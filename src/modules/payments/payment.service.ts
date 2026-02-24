import { PaymentState } from "@prisma/client";
import { paymentRepository } from "./payment.repository";
import { paymentHelpers } from "./payment.helpers";
import { bookingEventRepository } from "../bookings/booking-event.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { assertTransition } from "../../utils/stateMachine";
import { paymentTransitions } from "./payment.transitions";
import {
  paymentGatewayService,
  ExternalPaymentProvider,
} from "../../integrations/payment-gateway";
import { escrowService } from "../escrow/escrow.service";

const toNumber = (value: unknown) =>
  typeof value === "number" ? value : Number(value);

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const mapExternalStatus = (status: string): PaymentState | null => {
  const normalized = status.toUpperCase();

  if (["COMPLETED", "SUCCESS", "SUCCESSFUL", "PAID", "CAPTURED"].includes(normalized)) {
    return "COMPLETED";
  }

  if (["PENDING", "PROCESSING", "REQUIRES_ACTION", "AUTHORIZED"].includes(normalized)) {
    return "PENDING";
  }

  if (["FAILED", "DECLINED", "ERROR", "EXPIRED"].includes(normalized)) {
    return "FAILED";
  }

  if (["CANCELLED", "CANCELED", "VOIDED"].includes(normalized)) {
    return "CANCELLED";
  }

  return null;
};

export const paymentService = {
  create: async (data: {
    bookingId: string;
    provider:
      | "MPESA"
      | "STRIPE"
      | "PAYPAL"
      | "VISA"
      | "MASTERCARD"
      | "CRYPTO";
    amount: number;
    currency?: "USD" | "KES";
    reference?: string;
    metadata?: Record<string, unknown>;
    actorId?: string;
    state?: PaymentState;
  }) => {
    await paymentHelpers.canAddPayment(data.bookingId);

    const payment = await paymentRepository.create({
      bookingId: data.bookingId,
      provider: data.provider,
      amount: data.amount,
      currency: data.currency,
      reference: data.reference,
      metadata: data.metadata,
      state: data.state,
      recordedById: data.actorId,
    });

    await bookingEventRepository.create({
      bookingId: data.bookingId,
      type: "PAYMENT_CREATED",
      metadata: {
        paymentId: payment.id,
        provider: payment.provider,
        amount: payment.amount.toString(),
      },
    });

    if (payment.state === "COMPLETED") {
      await escrowService.recordHold({
        bookingId: payment.bookingId,
        amount: toNumber(payment.amount),
        currency: payment.currency as "USD" | "KES",
        metadata: { source: "CREATE_ENDPOINT" },
      });
    }

    return payment;
  },

  initiate: async (data: {
    bookingId: string;
    provider: ExternalPaymentProvider;
    amount: number;
    currency?: "USD" | "KES";
    reference?: string;
    metadata?: Record<string, unknown>;
    actorId?: string;
  }) => {
    await paymentHelpers.canAddPayment(data.bookingId);

    const currency = data.currency ?? "USD";
    const intent = await paymentGatewayService.createIntent({
      provider: data.provider,
      amount: data.amount,
      currency,
      reference: data.reference,
      metadata: data.metadata,
    });

    const payment = await paymentRepository.create({
      bookingId: data.bookingId,
      provider: data.provider,
      amount: data.amount,
      currency,
      reference: intent.reference,
      metadata: {
        ...(data.metadata ?? {}),
        intent,
        mode: "GATEWAY",
      },
      state: "INITIATED",
      recordedById: data.actorId,
    });

    await bookingEventRepository.create({
      bookingId: data.bookingId,
      type: "PAYMENT_CREATED",
      metadata: {
        paymentId: payment.id,
        provider: payment.provider,
        amount: payment.amount.toString(),
        mode: "GATEWAY",
        intentReference: intent.reference,
      },
    });

    return { payment, intent };
  },

  registerManual: async (data: {
    bookingId: string;
    provider: string;
    amount: number;
    currency?: "USD" | "KES";
    reference?: string;
    metadata?: Record<string, unknown>;
    notes?: string;
    recordedAt?: Date;
    actorId?: string;
    state?: PaymentState;
  }) => {
    await paymentHelpers.canAddPayment(data.bookingId);

    const currency = data.currency ?? "USD";
    const targetState = data.state ?? "COMPLETED";
    const recordedAt = data.recordedAt ?? new Date();

    const metadata = {
      ...(data.metadata ?? {}),
      mode: "MANUAL",
      notes: data.notes,
      recordedAt: recordedAt.toISOString(),
    };

    const payment = await paymentRepository.create({
      bookingId: data.bookingId,
      provider: data.provider,
      amount: data.amount,
      currency,
      reference: data.reference,
      metadata,
      state: targetState,
      recordedById: data.actorId,
    });

    await bookingEventRepository.create({
      bookingId: data.bookingId,
      type: "PAYMENT_COMPLETED",
      metadata: {
        paymentId: payment.id,
        provider: payment.provider,
        amount: payment.amount.toString(),
        mode: "MANUAL",
        recordedAt: recordedAt.toISOString(),
      },
    });

    await paymentHelpers.syncPaymentStatus(data.bookingId);

    await escrowService.recordHold({
      bookingId: payment.bookingId,
      amount: toNumber(payment.amount),
      currency: payment.currency as "USD" | "KES",
      metadata: { source: "MANUAL" },
    });

    return payment;
  },

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      paymentRepository.findMany({
        skip,
        take: limit,
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        sort: params?.sort,
      }),
      paymentRepository.count({
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
      }),
    ]);

    return {
      data,
      meta: calculatePagination(total, page, limit),
    };
  },

  getById: (id: string) => paymentRepository.findById(id),

  update: async (
    id: string,
    data: {
      state?: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
      reference?: string;
      metadata?: Record<string, unknown>;
      transitionReason?: string;
    }
  ) => {
    const payment = await paymentRepository.findById(id);
    if (!payment) {
      throw new Error("Payment not found");
    }

    if (data.state) {
      assertTransition({
        entity: "payment",
        currentState: payment.state,
        targetState: data.state,
        transitions: paymentTransitions,
      });
    }

    // Filter out fields that don't exist in the Payment model
    const { transitionReason: _transitionReason, ...updateData } = data;
    const updatedPayment = await paymentRepository.update(id, updateData);

    if (data.state && data.state !== payment.state) {
      await bookingEventRepository.create({
        bookingId: payment.bookingId,
        type: "UPDATED",
        metadata: {
          entity: "PAYMENT",
          paymentId: payment.id,
          fromState: payment.state,
          toState: data.state,
          reason: data.transitionReason,
        },
      });
    }

    if (data.state === "COMPLETED") {
      const newPaymentStatus = await paymentHelpers.syncPaymentStatus(
        payment.bookingId
      );

      await bookingEventRepository.create({
        bookingId: payment.bookingId,
        type: "PAYMENT_COMPLETED",
        metadata: {
          paymentId: payment.id,
          bookingPaymentStatus: newPaymentStatus,
          reason: data.transitionReason,
        },
      });

      await escrowService.recordHold({
        bookingId: payment.bookingId,
        amount: toNumber(updatedPayment.amount),
        currency: updatedPayment.currency as "USD" | "KES",
        metadata: { source: "STATE_UPDATE" },
      });
    } else if (data.state === "FAILED") {
      await bookingEventRepository.create({
        bookingId: payment.bookingId,
        type: "PAYMENT_FAILED",
        metadata: {
          paymentId: payment.id,
          reason: data.transitionReason ?? data.metadata?.reason ?? "Unknown",
        },
      });
    }

    return updatedPayment;
  },

  processWebhookEvent: async (data: {
    provider: ExternalPaymentProvider;
    reference: string;
    status: string;
    amount?: number;
    currency?: "USD" | "KES";
    eventType?: string;
    metadata?: Record<string, unknown>;
    rawPayload?: unknown;
    headers?: Record<string, unknown>;
    eventId?: string;
    reason?: string;
  }) => {
    const payment = await paymentRepository.findByReference(data.reference);
    if (!payment) {
      console.warn(
        `[payments] webhook ignored – payment not found for reference ${data.reference}`
      );
      return { handled: false, reason: "NOT_FOUND" };
    }

    const currentMetadata = toRecord(payment.metadata);
    const existingLogs = Array.isArray(currentMetadata["webhookLogs"])
      ? (currentMetadata["webhookLogs"] as Array<Record<string, unknown>>)
      : [];
    const existingProcessed = Array.isArray(
      currentMetadata["processedWebhookEventIds"]
    )
      ? (currentMetadata["processedWebhookEventIds"] as Array<unknown>)
          .filter((entry): entry is string => typeof entry === "string")
      : [];
    const isDuplicate = Boolean(
      data.eventId && existingProcessed.includes(data.eventId)
    );

    const webhookSnapshot: Record<string, unknown> = {
      provider: data.provider,
      status: data.status,
      eventType: data.eventType,
      amount: data.amount,
      currency: data.currency,
      receivedAt: new Date().toISOString(),
      metadata: data.metadata,
      rawPayload: data.rawPayload,
      headers: data.headers,
      eventId: data.eventId,
      reason: data.reason,
      duplicate: isDuplicate,
    };

    const webhookLogs = [...existingLogs.slice(-9), webhookSnapshot];

    const processedWebhookEventIds = data.eventId && !isDuplicate
      ? [...existingProcessed.slice(-19), data.eventId]
      : existingProcessed;

    const mergedMetadata: Record<string, unknown> = {
      ...currentMetadata,
      webhookLogs,
      lastWebhook: webhookSnapshot,
      processedWebhookEventIds,
    };

    const targetState = mapExternalStatus(data.status);
    const transitionReason = `WEBHOOK:${data.provider}:${data.eventType ?? data.status}`;

    if (data.amount && toNumber(payment.amount) !== data.amount) {
      mergedMetadata.amountMismatch = {
        reported: data.amount,
        recorded: toNumber(payment.amount),
      };
    }

    const updatePayload: {
      state?: PaymentState;
      metadata: Record<string, unknown>;
      transitionReason?: string;
    } = {
      metadata: mergedMetadata,
    };

    if (targetState && targetState !== payment.state) {
      updatePayload.state = targetState;
      updatePayload.transitionReason = transitionReason;
    }

    await paymentService.update(payment.id, updatePayload);

    return {
      handled: true,
      paymentId: payment.id,
      targetState: updatePayload.state ?? payment.state,
      duplicate: isDuplicate,
    };
  },

  remove: (id: string) => paymentRepository.remove(id),
};

import { paymentRepository } from "./payment.repository";
import { paymentHelpers } from "./payment.helpers";
import { bookingEventRepository } from "../bookings/booking-event.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { assertTransition } from "../../utils/stateMachine";
import { paymentTransitions } from "./payment.transitions";

export const paymentService = {
  create: async (data: {
    bookingId: string;
    provider: "MPESA" | "STRIPE" | "PAYPAL" | "VISA" | "MASTERCARD";
    amount: number;
    currency?: "USD" | "KES";
    reference?: string;
    metadata?: Record<string, unknown>;
  }) => {
    await paymentHelpers.canAddPayment(data.bookingId);

    const payment = await paymentRepository.create(data);

    await bookingEventRepository.create({
      bookingId: data.bookingId,
      type: "PAYMENT_CREATED",
      metadata: {
        paymentId: payment.id,
        provider: payment.provider,
        amount: payment.amount.toString(),
      },
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
    const { transitionReason, ...updateData } = data;
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

  remove: (id: string) => paymentRepository.remove(id),
};

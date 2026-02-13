import { BookingStatus } from "@prisma/client";
import { bookingRepository } from "./booking.repository";
import { bookingEventRepository } from "./booking-event.repository";
import { calculateCommission, BOOKING_COMMISSION_RATE, convertUsdToKes } from "./booking.constants";
import { assertTransition } from "../../utils/stateMachine";
import { bookingTransitions } from "./booking.transitions";
import { validateStatusRules } from "./booking.rules";
import { bookingLifecycleRules } from "./booking.lifecycle-rules";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";

export const bookingService = {
  create: async (data: {
    customerName: string;
    serviceTitle: string;
    amount: number;
    currency?: "USD" | "KES";
    status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
    paymentStatus?: "UNPAID" | "PAID";
    agentId: string;
    serviceStartAt?: Date;
    serviceEndAt?: Date;
    serviceTimezone?: string;
    actorId?: string;
  }) => {
    validateStatusRules(
      {
        status: "DRAFT",
        paymentStatus: "UNPAID",
      },
      {
        status: data.status,
        paymentStatus: data.paymentStatus,
      }
    );

    const currency = data.currency ?? "USD";
    const commissionAmount = calculateCommission(data.amount);
    
    // Commission is always in KES (provider currency)
    const commissionInKes = currency === "USD" 
      ? convertUsdToKes(commissionAmount)
      : commissionAmount;

    const booking = await bookingRepository.create({
      ...data,
      currency,
      commissionRate: BOOKING_COMMISSION_RATE.toString(),
      commissionAmount: commissionInKes.toString(),
      commissionCurrency: "KES",
    });

    await bookingEventRepository.create({
      bookingId: booking.id,
      type: "CREATED",
      actorId: data.actorId,
      metadata: {
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        amount: booking.amount.toString(),
        currency: booking.currency,
      },
    });

    return booking;
  },

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    agentId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    serviceStartFrom?: Date;
    serviceStartTo?: Date;
    sort?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      bookingRepository.findMany({
        skip,
        take: limit,
        status: params?.status,
        agentId: params?.agentId,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        serviceStartFrom: params?.serviceStartFrom,
        serviceStartTo: params?.serviceStartTo,
        sort: params?.sort,
      }),
      bookingRepository.count({
        status: params?.status,
        agentId: params?.agentId,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        serviceStartFrom: params?.serviceStartFrom,
        serviceStartTo: params?.serviceStartTo,
      }),
    ]);

    return {
      data,
      meta: calculatePagination(total, page, limit),
    };
  },

  getById: (id: string) => bookingRepository.findById(id),

  update: async (
    id: string,
    data: {
      customerName?: string;
      serviceTitle?: string;
      amount?: number;
      currency?: "USD" | "KES";
      status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
      paymentStatus?: "UNPAID" | "PAID";
      agentId?: string;
      serviceStartAt?: Date;
      serviceEndAt?: Date;
      serviceTimezone?: string;
      transitionReason?: string;
      actorId?: string;
    }
  ) => {
    const current = await bookingRepository.findById(id);
    if (!current) {
      throw new Error("Booking not found");
    }

    if (data.status) {
      assertTransition({
        entity: "booking",
        currentState: current.status as BookingStatus,
        targetState: data.status,
        transitions: bookingTransitions,
      });
    }

    validateStatusRules(
      {
        status: current.status as BookingStatus,
        paymentStatus: current.paymentStatus,
      },
      data
    );

    let commissionAmount: string | undefined;
    let commissionCurrency: "USD" | "KES" | undefined;

    if (typeof data.amount === "number") {
      const commission = calculateCommission(data.amount);
      const currency = data.currency ?? (current.currency as "USD" | "KES");
      commissionAmount = (currency === "USD" 
        ? convertUsdToKes(commission) 
        : commission).toString();
      commissionCurrency = "KES";
    }

    const booking = await bookingRepository.update(id, {
      ...data,
      commissionAmount,
      commissionCurrency,
    });

    const eventType = data.status ? "STATUS_CHANGED" : "UPDATED";

    await bookingEventRepository.create({
      bookingId: booking.id,
      type: eventType,
      actorId: data.actorId,
      metadata: {
        fromStatus: current.status,
        toStatus: data.status ?? current.status,
        reason: data.transitionReason,
      },
    });

    return booking;
  },

  transitionStatus: async (data: {
    id: string;
    toStatus: "DRAFT" | "CONFIRMED" | "CANCELLED";
    transitionReason?: string;
    actorId?: string;
  }) => {
    const current = await bookingRepository.findById(data.id);
    if (!current) {
      throw new Error("Booking not found");
    }

    assertTransition({
      entity: "booking",
      currentState: current.status as BookingStatus,
      targetState: data.toStatus,
      transitions: bookingTransitions,
    });

    if (data.toStatus === "CONFIRMED") {
      bookingLifecycleRules.canConfirm({
        status: current.status as BookingStatus,
        paymentStatus: current.paymentStatus,
      });
    } else if (data.toStatus === "CANCELLED") {
      bookingLifecycleRules.canCancel({
        status: current.status as BookingStatus,
        paymentStatus: current.paymentStatus,
      });
    }

    validateStatusRules(
      {
        status: current.status as BookingStatus,
        paymentStatus: current.paymentStatus,
      },
      { status: data.toStatus }
    );

    const booking = await bookingRepository.update(data.id, {
      status: data.toStatus,
    });

    await bookingEventRepository.create({
      bookingId: booking.id,
      type: "STATUS_CHANGED",
      actorId: data.actorId,
      metadata: {
        fromStatus: current.status,
        toStatus: booking.status,
        reason: data.transitionReason,
      },
    });

    return booking;
  },

  remove: (id: string) => bookingRepository.remove(id),
};

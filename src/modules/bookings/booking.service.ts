import { BookingStatus, Prisma } from "@prisma/client";
import { bookingRepository } from "./booking.repository";
import { bookingEventRepository } from "./booking-event.repository";
import { calculateCommission, BOOKING_COMMISSION_RATE, convertUsdToKes } from "./booking.constants";
import { assertTransition } from "../../utils/stateMachine";
import { bookingTransitions } from "./booking.transitions";
import { validateStatusRules } from "./booking.rules";
import { bookingLifecycleRules } from "./booking.lifecycle-rules";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { shiftService } from "../shifts/shift.service";
import { offerService } from "../offers/offer.service";
import { partnerRepository } from "../partners/partner.repository";
import { ApiError } from "../../utils/ApiError";
import { generateBookingReference } from "../../utils/referenceNumber";

const MIN_DEPOSIT_PERCENTAGE = new Prisma.Decimal("0.10");
const MAX_DEPOSIT_PERCENTAGE = new Prisma.Decimal("1.00");
const DEFAULT_DEPOSIT_PERCENTAGE = new Prisma.Decimal("0.50");

const decimalToNumber = (
  value?: Prisma.Decimal | number | string | null
): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return Number(value);
  }
  return (value as Prisma.Decimal).toNumber();
};

type SplitPaymentInput = {
  amount: number;
  splitPaymentEnabled?: boolean;
  depositPercentage?: number;
  depositAmount?: number;
  depositDueDate?: Date;
  balanceDueDate?: Date;
  splitPaymentNotes?: string;
};

type SplitPaymentPlan = {
  splitPaymentEnabled: boolean;
  depositPercentage: Prisma.Decimal | null;
  depositAmount: Prisma.Decimal | null;
  balanceAmount: Prisma.Decimal | null;
  depositDueDate: Date | null;
  balanceDueDate: Date | null;
  splitPaymentNotes: string | null;
};

const deriveSplitPaymentPlan = (input: SplitPaymentInput): SplitPaymentPlan => {
  const enabled = input.splitPaymentEnabled ?? false;

  if (!enabled) {
    return {
      splitPaymentEnabled: false,
      depositPercentage: null,
      depositAmount: null,
      balanceAmount: null,
      depositDueDate: null,
      balanceDueDate: null,
      splitPaymentNotes: null,
    };
  }

  const totalAmount = new Prisma.Decimal(input.amount);

  let percentage =
    input.depositPercentage !== undefined
      ? new Prisma.Decimal(input.depositPercentage)
      : null;
  let deposit =
    input.depositAmount !== undefined
      ? new Prisma.Decimal(input.depositAmount)
      : null;

  if (!percentage && !deposit) {
    percentage = DEFAULT_DEPOSIT_PERCENTAGE;
  }

  if (percentage && !deposit) {
    deposit = totalAmount.mul(percentage);
  }

  if (!percentage && deposit) {
    percentage = deposit.div(totalAmount);
  }

  if (!percentage || !deposit) {
    throw new ApiError(400, "INVALID_REQUEST", "Unable to determine split payment values");
  }

  if (percentage.lessThan(MIN_DEPOSIT_PERCENTAGE)) {
    throw new ApiError(400, "INVALID_REQUEST", "Deposit percentage must be at least 10%");
  }

  if (percentage.greaterThan(MAX_DEPOSIT_PERCENTAGE)) {
    throw new ApiError(400, "INVALID_REQUEST", "Deposit percentage cannot exceed 100%");
  }

  if (deposit.lessThanOrEqualTo(0)) {
    throw new ApiError(400, "INVALID_REQUEST", "Deposit amount must be greater than zero");
  }

  if (deposit.greaterThan(totalAmount)) {
    throw new ApiError(400, "INVALID_REQUEST", "Deposit amount cannot exceed booking amount");
  }

  const balance = totalAmount.minus(deposit);

  if (balance.lessThan(0)) {
    throw new ApiError(400, "INVALID_REQUEST", "Balance amount cannot be negative");
  }

  return {
    splitPaymentEnabled: true,
    depositPercentage: percentage,
    depositAmount: deposit,
    balanceAmount: balance,
    depositDueDate: input.depositDueDate ?? null,
    balanceDueDate: input.balanceDueDate ?? null,
    splitPaymentNotes: input.splitPaymentNotes ?? null,
  };
};

const serializeSplitPlan = (plan: SplitPaymentPlan) => ({
  splitPaymentEnabled: plan.splitPaymentEnabled,
  depositPercentage: plan.depositPercentage?.toString() ?? null,
  depositAmount: plan.depositAmount?.toString() ?? null,
  depositDueDate: plan.depositDueDate,
  balanceAmount: plan.balanceAmount?.toString() ?? null,
  balanceDueDate: plan.balanceDueDate,
  splitPaymentNotes: plan.splitPaymentNotes,
});

const validateBookingPartners = async (
  partners?: Array<{
    partnerId: string;
    partnerServiceId?: string;
    partnerName: string;
    partnerPhoneNumber?: string;
    description?: string;
    costAtBooking: number;
    costPostEvent: number;
  }>
) => {
  if (!partners || partners.length === 0) {
    return;
  }

  // Check for duplicate partners
  const partnerIds = partners.map(p => p.partnerId);
  const uniquePartnerIds = new Set(partnerIds);
  if (uniquePartnerIds.size !== partnerIds.length) {
    throw new ApiError(
      400,
      "INVALID_REQUEST",
      "Duplicate partners provided. Each partner can only be added once per booking."
    );
  }

  // Validate each partner exists
  for (const partner of partners) {
    const existingPartner = await partnerRepository.findById(partner.partnerId);
    if (!existingPartner) {
      throw new ApiError(
        400,
        "PARTNER_NOT_FOUND",
        `Partner with ID '${partner.partnerId}' does not exist. Please create the partner first or use a valid partner ID.`
      );
    }
  }
};

const syncBookingShift = async (
  booking: {
    id: string;
    agentId: string | null;
    status: BookingStatus;
    serviceStartAt: Date | null;
    serviceEndAt: Date | null;
  },
  actorId?: string,
  source?: string
) => {
  if (!booking.agentId) {
    return;
  }

  await shiftService.syncWithBooking({
    bookingId: booking.id,
    agentId: booking.agentId,
    status: booking.status as BookingStatus,
    startAt: booking.serviceStartAt ?? undefined,
    endAt: booking.serviceEndAt ?? undefined,
    actorId,
    source,
  });
};

export const bookingService = {
  create: async (data: {
    customerName: string;
    customerEmail?: string;
    customerPhoneNumber?: string;
    serviceTitle: string;
    pickupLocation?: string;
    destination?: string;
    numberOfGuests?: number;
    numberOfChildren?: number;
    numberOfPets?: number;
    notes?: string;
    amount: number;
    currency?: "USD" | "KES";
    status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
    paymentStatus?: "UNPAID" | "PARTIAL" | "PAID";
    paymentType?: "FULL_PAYMENT" | "PARTIAL_PAYMENT";
    costAtBooking?: number;
    costPostEvent?: number;
    payPostEventDueDate?: Date;
    agentId: string;
    serviceStartAt?: Date;
    serviceEndAt?: Date;
    serviceTimezone?: string;
    actorId?: string;
    bookingPartners?: Array<{
      partnerId: string;
      partnerServiceId?: string;
      partnerName: string;
      partnerPhoneNumber?: string;
      description?: string;
      costAtBooking: number;
      costPostEvent: number;
    }>;
    splitPaymentEnabled?: boolean;
    depositPercentage?: number;
    depositAmount?: number;
    depositDueDate?: Date;
    balanceDueDate?: Date;
    splitPaymentNotes?: string;
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

    // Validate booking partners exist before proceeding
    await validateBookingPartners(data.bookingPartners);

    const currency = data.currency ?? "USD";
    const commissionAmount = calculateCommission(data.amount);
    
    // Commission is always in KES (provider currency)
    const commissionInKes = currency === "USD" 
      ? convertUsdToKes(commissionAmount)
      : commissionAmount;

    const splitPlan = deriveSplitPaymentPlan({
      amount: data.amount,
      splitPaymentEnabled: data.splitPaymentEnabled,
      depositPercentage: data.depositPercentage,
      depositAmount: data.depositAmount,
      depositDueDate: data.depositDueDate,
      balanceDueDate: data.balanceDueDate,
      splitPaymentNotes: data.splitPaymentNotes,
    });

    const splitPersistence = serializeSplitPlan(splitPlan);

    // Calculate total cost from partners if provided
    let totalCost: string | undefined = undefined;
    if (data.bookingPartners && data.bookingPartners.length > 0) {
      const partnerTotal = data.bookingPartners.reduce((sum, partner) => {
        return sum + partner.costAtBooking + partner.costPostEvent;
      }, 0);
      totalCost = partnerTotal.toString();
    }

    const bookingData: any = {
      ...data,
      currency,
      commissionRate: BOOKING_COMMISSION_RATE.toString(),
      commissionAmount: commissionInKes.toString(),
      commissionCurrency: "KES",
      paymentType: data.paymentType ?? "FULL_PAYMENT",
      costAtBooking: data.costAtBooking ? new Prisma.Decimal(data.costAtBooking) : null,
      costPostEvent: data.costPostEvent ? new Prisma.Decimal(data.costPostEvent) : null,
      totalCost: totalCost ? new Prisma.Decimal(totalCost) : null,
      ...splitPersistence,
    };

    // Handle booking partners separately
    const bookingPartners = data.bookingPartners;
    delete bookingData.bookingPartners;

    // Generate atomic reference number
    const { referenceNumber, referenceSeq } = await generateBookingReference();

    // Create booking with partners
    const booking = await bookingRepository.create({
      ...bookingData,
      referenceNumber,
      referenceSeq,
      ...(bookingPartners && bookingPartners.length > 0 && {
        bookingPartners: {
          createMany: {
            data: bookingPartners.map(p => ({
              partnerId: p.partnerId,
              partnerServiceId: p.partnerServiceId ?? null,
              partnerName: p.partnerName,
              partnerPhoneNumber: p.partnerPhoneNumber,
              description: p.description,
              costAtBooking: new Prisma.Decimal(p.costAtBooking),
              costPostEvent: new Prisma.Decimal(p.costPostEvent),
              totalCost: new Prisma.Decimal(p.costAtBooking + p.costPostEvent),
            }))
          }
        }
      })
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
        paymentType: booking.paymentType,
        partnerCount: bookingPartners?.length ?? 0,
      },
    });

    await syncBookingShift(booking, data.actorId, "BOOKING_CREATE");

    await offerService.ensureProposalForBooking(booking.id);

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
    search?: string;
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
        search: params?.search,
      }),
      bookingRepository.count({
        status: params?.status,
        agentId: params?.agentId,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        serviceStartFrom: params?.serviceStartFrom,
        serviceStartTo: params?.serviceStartTo,
        search: params?.search,
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
      customerPhoneNumber?: string;
      serviceTitle?: string;
      amount?: number;
      currency?: "USD" | "KES";
      status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
      paymentStatus?: "UNPAID" | "PARTIAL" | "PAID";
      paymentType?: "FULL_PAYMENT" | "PARTIAL_PAYMENT";
      costAtBooking?: number;
      costPostEvent?: number;
      payPostEventDueDate?: Date;
      agentId?: string;
      serviceStartAt?: Date;
      serviceEndAt?: Date;
      serviceTimezone?: string;
      transitionReason?: string;
      actorId?: string;
      bookingPartners?: Array<{
        partnerId: string;
        partnerName: string;
        partnerPhoneNumber?: string;
        description?: string;
        costAtBooking: number;
        costPostEvent: number;
      }>;
      splitPaymentEnabled?: boolean;
      depositPercentage?: number;
      depositAmount?: number;
      depositDueDate?: Date;
      balanceDueDate?: Date;
      splitPaymentNotes?: string;
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

    if (data.status || data.paymentStatus) {
      validateStatusRules(
        {
          status: current.status as BookingStatus,
          paymentStatus: current.paymentStatus,
        },
        {
          status: data.status,
          paymentStatus: data.paymentStatus,
        }
      );
    }

    let commissionAmount: string | undefined;
    let commissionCurrency: "USD" | "KES" | undefined;
    if (typeof data.amount === "number") {
      const commission = calculateCommission(data.amount);
      const currency = data.currency ?? (current.currency as "USD" | "KES");
      commissionAmount = (
        currency === "USD" ? convertUsdToKes(commission) : commission
      ).toString();
      commissionCurrency = "KES";
    }

    const requiresSplitUpdate = [
      "amount",
      "splitPaymentEnabled",
      "depositPercentage",
      "depositAmount",
      "depositDueDate",
      "balanceDueDate",
      "splitPaymentNotes",
    ].some((key) => (data as Record<string, unknown>)[key] !== undefined);

    let splitPersistence: Record<string, unknown> | undefined;

    if (requiresSplitUpdate) {
      const baseAmount = data.amount ?? decimalToNumber(current.amount);
      if (baseAmount === undefined) {
        throw new Error("Unable to determine booking amount for split payments");
      }

      const splitPlan = deriveSplitPaymentPlan({
        amount: baseAmount,
        splitPaymentEnabled:
          data.splitPaymentEnabled ?? current.splitPaymentEnabled ?? false,
        depositPercentage:
          data.depositPercentage ?? decimalToNumber(current.depositPercentage),
        depositAmount:
          data.depositAmount ?? decimalToNumber(current.depositAmount),
        depositDueDate:
          data.depositDueDate ?? current.depositDueDate ?? undefined,
        balanceDueDate:
          data.balanceDueDate ?? current.balanceDueDate ?? undefined,
        splitPaymentNotes:
          data.splitPaymentNotes ?? current.splitPaymentNotes ?? undefined,
      });

      splitPersistence = serializeSplitPlan(splitPlan);
    }

    const booking = await bookingRepository.update(id, {
      ...data,
      ...(commissionAmount
        ? { commissionAmount, commissionCurrency: commissionCurrency ?? "KES" }
        : {}),
      ...(splitPersistence ?? {}),
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

    await syncBookingShift(booking, data.actorId, "BOOKING_UPDATE");

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

    await syncBookingShift(booking, data.actorId, "BOOKING_TRANSITION");

    return booking;
  },

  remove: (id: string) => bookingRepository.remove(id),

  listEvents: async (params: {
    bookingId: string;
    page?: number;
    limit?: number;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: "asc" | "desc";
  }): Promise<PaginatedResponse<any>> => {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      bookingEventRepository.listByBooking({
        bookingId: params.bookingId,
        skip,
        take: limit,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        sort: params.sort,
      }),
      bookingEventRepository.countByBooking({
        bookingId: params.bookingId,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      }),
    ]);

    return {
      data: events,
      meta: calculatePagination(total, page, limit),
    };
  },
};

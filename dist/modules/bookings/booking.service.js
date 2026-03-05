"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const client_1 = require("@prisma/client");
const booking_repository_1 = require("./booking.repository");
const booking_event_repository_1 = require("./booking-event.repository");
const booking_constants_1 = require("./booking.constants");
const stateMachine_1 = require("../../utils/stateMachine");
const booking_transitions_1 = require("./booking.transitions");
const booking_rules_1 = require("./booking.rules");
const booking_lifecycle_rules_1 = require("./booking.lifecycle-rules");
const pagination_1 = require("../../utils/pagination");
const shift_service_1 = require("../shifts/shift.service");
const offer_service_1 = require("../offers/offer.service");
const partner_repository_1 = require("../partners/partner.repository");
const ApiError_1 = require("../../utils/ApiError");
const referenceNumber_1 = require("../../utils/referenceNumber");
const MIN_DEPOSIT_PERCENTAGE = new client_1.Prisma.Decimal("0.10");
const MAX_DEPOSIT_PERCENTAGE = new client_1.Prisma.Decimal("1.00");
const DEFAULT_DEPOSIT_PERCENTAGE = new client_1.Prisma.Decimal("0.50");
const decimalToNumber = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "number") {
        return value;
    }
    if (typeof value === "string") {
        return Number(value);
    }
    return value.toNumber();
};
const deriveSplitPaymentPlan = (input) => {
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
    const totalAmount = new client_1.Prisma.Decimal(input.amount);
    let percentage = input.depositPercentage !== undefined
        ? new client_1.Prisma.Decimal(input.depositPercentage)
        : null;
    let deposit = input.depositAmount !== undefined
        ? new client_1.Prisma.Decimal(input.depositAmount)
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
        throw new ApiError_1.ApiError(400, "INVALID_REQUEST", "Unable to determine split payment values");
    }
    if (percentage.lessThan(MIN_DEPOSIT_PERCENTAGE)) {
        throw new ApiError_1.ApiError(400, "INVALID_REQUEST", "Deposit percentage must be at least 10%");
    }
    if (percentage.greaterThan(MAX_DEPOSIT_PERCENTAGE)) {
        throw new ApiError_1.ApiError(400, "INVALID_REQUEST", "Deposit percentage cannot exceed 100%");
    }
    if (deposit.lessThanOrEqualTo(0)) {
        throw new ApiError_1.ApiError(400, "INVALID_REQUEST", "Deposit amount must be greater than zero");
    }
    if (deposit.greaterThan(totalAmount)) {
        throw new ApiError_1.ApiError(400, "INVALID_REQUEST", "Deposit amount cannot exceed booking amount");
    }
    const balance = totalAmount.minus(deposit);
    if (balance.lessThan(0)) {
        throw new ApiError_1.ApiError(400, "INVALID_REQUEST", "Balance amount cannot be negative");
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
const serializeSplitPlan = (plan) => ({
    splitPaymentEnabled: plan.splitPaymentEnabled,
    depositPercentage: plan.depositPercentage?.toString() ?? null,
    depositAmount: plan.depositAmount?.toString() ?? null,
    depositDueDate: plan.depositDueDate,
    balanceAmount: plan.balanceAmount?.toString() ?? null,
    balanceDueDate: plan.balanceDueDate,
    splitPaymentNotes: plan.splitPaymentNotes,
});
const validateBookingPartners = async (partners) => {
    if (!partners || partners.length === 0) {
        return;
    }
    // Check for duplicate partners
    const partnerIds = partners.map(p => p.partnerId);
    const uniquePartnerIds = new Set(partnerIds);
    if (uniquePartnerIds.size !== partnerIds.length) {
        throw new ApiError_1.ApiError(400, "INVALID_REQUEST", "Duplicate partners provided. Each partner can only be added once per booking.");
    }
    // Validate each partner exists
    for (const partner of partners) {
        const existingPartner = await partner_repository_1.partnerRepository.findById(partner.partnerId);
        if (!existingPartner) {
            throw new ApiError_1.ApiError(400, "PARTNER_NOT_FOUND", `Partner with ID '${partner.partnerId}' does not exist. Please create the partner first or use a valid partner ID.`);
        }
    }
};
const syncBookingShift = async (booking, actorId, source) => {
    if (!booking.agentId) {
        return;
    }
    await shift_service_1.shiftService.syncWithBooking({
        bookingId: booking.id,
        agentId: booking.agentId,
        status: booking.status,
        startAt: booking.serviceStartAt ?? undefined,
        endAt: booking.serviceEndAt ?? undefined,
        actorId,
        source,
    });
};
exports.bookingService = {
    create: async (data) => {
        (0, booking_rules_1.validateStatusRules)({
            status: "DRAFT",
            paymentStatus: "UNPAID",
        }, {
            status: data.status,
            paymentStatus: data.paymentStatus,
        });
        // Validate booking partners exist before proceeding
        await validateBookingPartners(data.bookingPartners);
        const currency = data.currency ?? "USD";
        const commissionAmount = (0, booking_constants_1.calculateCommission)(data.amount);
        // Commission is always in KES (provider currency)
        const commissionInKes = currency === "USD"
            ? (0, booking_constants_1.convertUsdToKes)(commissionAmount)
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
        let totalCost = undefined;
        if (data.bookingPartners && data.bookingPartners.length > 0) {
            const partnerTotal = data.bookingPartners.reduce((sum, partner) => {
                return sum + partner.costAtBooking + partner.costPostEvent;
            }, 0);
            totalCost = partnerTotal.toString();
        }
        const bookingData = {
            ...data,
            currency,
            commissionRate: booking_constants_1.BOOKING_COMMISSION_RATE.toString(),
            commissionAmount: commissionInKes.toString(),
            commissionCurrency: "KES",
            paymentType: data.paymentType ?? "FULL_PAYMENT",
            costAtBooking: data.costAtBooking ? new client_1.Prisma.Decimal(data.costAtBooking) : null,
            costPostEvent: data.costPostEvent ? new client_1.Prisma.Decimal(data.costPostEvent) : null,
            totalCost: totalCost ? new client_1.Prisma.Decimal(totalCost) : null,
            ...splitPersistence,
        };
        // Handle booking partners separately
        const bookingPartners = data.bookingPartners;
        delete bookingData.bookingPartners;
        // Generate atomic reference number
        const { referenceNumber, referenceSeq } = await (0, referenceNumber_1.generateBookingReference)();
        // Create booking with partners
        const booking = await booking_repository_1.bookingRepository.create({
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
                            costAtBooking: new client_1.Prisma.Decimal(p.costAtBooking),
                            costPostEvent: new client_1.Prisma.Decimal(p.costPostEvent),
                            totalCost: new client_1.Prisma.Decimal(p.costAtBooking + p.costPostEvent),
                        }))
                    }
                }
            })
        });
        await booking_event_repository_1.bookingEventRepository.create({
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
        await offer_service_1.offerService.ensureProposalForBooking(booking.id);
        return booking;
    },
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            booking_repository_1.bookingRepository.findMany({
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
            booking_repository_1.bookingRepository.count({
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
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => booking_repository_1.bookingRepository.findById(id),
    update: async (id, data) => {
        const current = await booking_repository_1.bookingRepository.findById(id);
        if (!current) {
            throw new Error("Booking not found");
        }
        if (data.status) {
            (0, stateMachine_1.assertTransition)({
                entity: "booking",
                currentState: current.status,
                targetState: data.status,
                transitions: booking_transitions_1.bookingTransitions,
            });
        }
        if (data.status || data.paymentStatus) {
            (0, booking_rules_1.validateStatusRules)({
                status: current.status,
                paymentStatus: current.paymentStatus,
            }, {
                status: data.status,
                paymentStatus: data.paymentStatus,
            });
        }
        let commissionAmount;
        let commissionCurrency;
        if (typeof data.amount === "number") {
            const commission = (0, booking_constants_1.calculateCommission)(data.amount);
            const currency = data.currency ?? current.currency;
            commissionAmount = (currency === "USD" ? (0, booking_constants_1.convertUsdToKes)(commission) : commission).toString();
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
        ].some((key) => data[key] !== undefined);
        let splitPersistence;
        if (requiresSplitUpdate) {
            const baseAmount = data.amount ?? decimalToNumber(current.amount);
            if (baseAmount === undefined) {
                throw new Error("Unable to determine booking amount for split payments");
            }
            const splitPlan = deriveSplitPaymentPlan({
                amount: baseAmount,
                splitPaymentEnabled: data.splitPaymentEnabled ?? current.splitPaymentEnabled ?? false,
                depositPercentage: data.depositPercentage ?? decimalToNumber(current.depositPercentage),
                depositAmount: data.depositAmount ?? decimalToNumber(current.depositAmount),
                depositDueDate: data.depositDueDate ?? current.depositDueDate ?? undefined,
                balanceDueDate: data.balanceDueDate ?? current.balanceDueDate ?? undefined,
                splitPaymentNotes: data.splitPaymentNotes ?? current.splitPaymentNotes ?? undefined,
            });
            splitPersistence = serializeSplitPlan(splitPlan);
        }
        const booking = await booking_repository_1.bookingRepository.update(id, {
            ...data,
            ...(commissionAmount
                ? { commissionAmount, commissionCurrency: commissionCurrency ?? "KES" }
                : {}),
            ...(splitPersistence ?? {}),
        });
        const eventType = data.status ? "STATUS_CHANGED" : "UPDATED";
        await booking_event_repository_1.bookingEventRepository.create({
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
    transitionStatus: async (data) => {
        const current = await booking_repository_1.bookingRepository.findById(data.id);
        if (!current) {
            throw new Error("Booking not found");
        }
        (0, stateMachine_1.assertTransition)({
            entity: "booking",
            currentState: current.status,
            targetState: data.toStatus,
            transitions: booking_transitions_1.bookingTransitions,
        });
        if (data.toStatus === "CONFIRMED") {
            booking_lifecycle_rules_1.bookingLifecycleRules.canConfirm({
                status: current.status,
                paymentStatus: current.paymentStatus,
            });
        }
        else if (data.toStatus === "CANCELLED") {
            booking_lifecycle_rules_1.bookingLifecycleRules.canCancel({
                status: current.status,
                paymentStatus: current.paymentStatus,
            });
        }
        (0, booking_rules_1.validateStatusRules)({
            status: current.status,
            paymentStatus: current.paymentStatus,
        }, { status: data.toStatus });
        const booking = await booking_repository_1.bookingRepository.update(data.id, {
            status: data.toStatus,
        });
        await booking_event_repository_1.bookingEventRepository.create({
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
    remove: (id) => booking_repository_1.bookingRepository.remove(id),
    listEvents: async (params) => {
        const page = params.page ?? 1;
        const limit = params.limit ?? 10;
        const skip = (page - 1) * limit;
        const [events, total] = await Promise.all([
            booking_event_repository_1.bookingEventRepository.listByBooking({
                bookingId: params.bookingId,
                skip,
                take: limit,
                dateFrom: params.dateFrom,
                dateTo: params.dateTo,
                sort: params.sort,
            }),
            booking_event_repository_1.bookingEventRepository.countByBooking({
                bookingId: params.bookingId,
                dateFrom: params.dateFrom,
                dateTo: params.dateTo,
            }),
        ]);
        return {
            data: events,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
};
//# sourceMappingURL=booking.service.js.map
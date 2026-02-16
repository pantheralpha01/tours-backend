"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteService = void 0;
const quote_repository_1 = require("./quote.repository");
const booking_constants_1 = require("../bookings/booking.constants");
const pagination_1 = require("../../utils/pagination");
exports.quoteService = {
    create: (data) => {
        const currency = data.currency ?? "USD";
        const commission = (0, booking_constants_1.calculateCommission)(data.amount);
        const commissionInKes = currency === "USD" ? (0, booking_constants_1.convertUsdToKes)(commission) : commission;
        return quote_repository_1.quoteRepository.create({
            ...data,
            currency,
            commissionRate: booking_constants_1.BOOKING_COMMISSION_RATE.toString(),
            commissionAmount: commissionInKes.toString(),
            commissionCurrency: "KES",
        });
    },
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            quote_repository_1.quoteRepository.findMany({
                skip,
                take: limit,
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                sort: params?.sort,
                bookingId: params?.bookingId,
                agentId: params?.agentId,
            }),
            quote_repository_1.quoteRepository.count({
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                bookingId: params?.bookingId,
                agentId: params?.agentId,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => quote_repository_1.quoteRepository.findById(id),
    update: (id, data) => {
        let commissionAmount;
        let commissionCurrency;
        if (typeof data.amount === "number") {
            const commission = (0, booking_constants_1.calculateCommission)(data.amount);
            const currency = data.currency ?? "USD";
            const commissionInKes = currency === "USD" ? (0, booking_constants_1.convertUsdToKes)(commission) : commission;
            commissionAmount = commissionInKes.toString();
            commissionCurrency = "KES";
        }
        return quote_repository_1.quoteRepository.update(id, {
            ...data,
            commissionAmount,
            commissionCurrency,
        });
    },
    remove: (id) => quote_repository_1.quoteRepository.remove(id),
};
//# sourceMappingURL=quote.service.js.map
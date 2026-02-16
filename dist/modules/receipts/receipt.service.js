"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptService = void 0;
const receipt_repository_1 = require("./receipt.repository");
const pagination_1 = require("../../utils/pagination");
exports.receiptService = {
    create: (data) => receipt_repository_1.receiptRepository.create({
        ...data,
        currency: data.currency ?? "USD",
    }),
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            receipt_repository_1.receiptRepository.findMany({
                skip,
                take: limit,
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                sort: params?.sort,
                bookingId: params?.bookingId,
                paymentId: params?.paymentId,
            }),
            receipt_repository_1.receiptRepository.count({
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                bookingId: params?.bookingId,
                paymentId: params?.paymentId,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => receipt_repository_1.receiptRepository.findById(id),
    update: (id, data) => receipt_repository_1.receiptRepository.update(id, data),
    remove: (id) => receipt_repository_1.receiptRepository.remove(id),
};
//# sourceMappingURL=receipt.service.js.map
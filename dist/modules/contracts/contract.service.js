"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractService = void 0;
const contract_repository_1 = require("./contract.repository");
const pagination_1 = require("../../utils/pagination");
exports.contractService = {
    create: (data) => contract_repository_1.contractRepository.create(data),
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            contract_repository_1.contractRepository.findMany({
                skip,
                take: limit,
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                sort: params?.sort,
                bookingId: params?.bookingId,
                partnerId: params?.partnerId,
            }),
            contract_repository_1.contractRepository.count({
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                bookingId: params?.bookingId,
                partnerId: params?.partnerId,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => contract_repository_1.contractRepository.findById(id),
    update: (id, data) => contract_repository_1.contractRepository.update(id, data),
    remove: (id) => contract_repository_1.contractRepository.remove(id),
};
//# sourceMappingURL=contract.service.js.map
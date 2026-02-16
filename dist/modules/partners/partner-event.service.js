"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerEventService = void 0;
const partner_event_repository_1 = require("./partner-event.repository");
const pagination_1 = require("../../utils/pagination");
exports.partnerEventService = {
    list: async (params) => {
        const page = params.page ?? 1;
        const limit = params.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            partner_event_repository_1.partnerEventRepository.findMany({
                partnerId: params.partnerId,
                skip,
                take: limit,
                type: params.type,
                dateFrom: params.dateFrom,
                dateTo: params.dateTo,
                sort: params.sort,
            }),
            partner_event_repository_1.partnerEventRepository.count({
                partnerId: params.partnerId,
                type: params.type,
                dateFrom: params.dateFrom,
                dateTo: params.dateTo,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
};
//# sourceMappingURL=partner-event.service.js.map
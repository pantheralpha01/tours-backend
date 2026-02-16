"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerService = void 0;
const partner_repository_1 = require("./partner.repository");
const pagination_1 = require("../../utils/pagination");
const partner_event_repository_1 = require("./partner-event.repository");
exports.partnerService = {
    create: (data) => partner_repository_1.partnerRepository.create(data),
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            partner_repository_1.partnerRepository.findMany({
                skip,
                take: limit,
                status: params?.status,
                approvalStatus: params?.approvalStatus,
                createdById: params?.createdById,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                sort: params?.sort,
            }),
            partner_repository_1.partnerRepository.count({
                status: params?.status,
                approvalStatus: params?.approvalStatus,
                createdById: params?.createdById,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => partner_repository_1.partnerRepository.findById(id),
    update: (id, data) => partner_repository_1.partnerRepository.update(id, data),
    approve: async (id, approvedById) => {
        const partner = await partner_repository_1.partnerRepository.update(id, {
            approvalStatus: "APPROVED",
            approvedById,
            approvedAt: new Date(),
            rejectedReason: null,
        });
        await partner_event_repository_1.partnerEventRepository.create({
            partnerId: id,
            type: "APPROVED",
            actorId: approvedById,
        });
        return partner;
    },
    reject: async (id, approvedById, reason) => {
        const partner = await partner_repository_1.partnerRepository.update(id, {
            approvalStatus: "REJECTED",
            approvedById,
            approvedAt: new Date(),
            rejectedReason: reason ?? null,
        });
        await partner_event_repository_1.partnerEventRepository.create({
            partnerId: id,
            type: "REJECTED",
            actorId: approvedById,
            metadata: reason ? { reason } : undefined,
        });
        return partner;
    },
    remove: (id) => partner_repository_1.partnerRepository.remove(id),
};
//# sourceMappingURL=partner.service.js.map
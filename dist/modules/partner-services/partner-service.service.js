"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerServiceService = void 0;
const ApiError_1 = require("../../utils/ApiError");
const prisma_1 = require("../../config/prisma");
const partner_service_repository_1 = require("./partner-service.repository");
/** Resolve the Partner record id from a User id (role: PARTNER) */
const resolvePartnerId = async (userId) => {
    const partner = await prisma_1.prisma.partner.findUnique({ where: { userId } });
    if (!partner)
        throw ApiError_1.ApiError.notFound("Partner profile not found for this user");
    if (partner.approvalStatus !== "APPROVED")
        throw ApiError_1.ApiError.forbidden("Your partner account must be approved before adding services");
    return partner.id;
};
exports.partnerServiceService = {
    // ── Partner actions ─────────────────────────────────────────────────────────
    createService: async (userId, data) => {
        const partnerId = await resolvePartnerId(userId);
        return partner_service_repository_1.partnerServiceRepository.create(partnerId, data);
    },
    updateService: async (userId, serviceId, data) => {
        const partnerId = await resolvePartnerId(userId);
        const owns = await partner_service_repository_1.partnerServiceRepository.belongsToPartner(serviceId, partnerId);
        if (!owns)
            throw ApiError_1.ApiError.notFound("Service not found or access denied");
        return partner_service_repository_1.partnerServiceRepository.update(serviceId, data);
    },
    deleteService: async (userId, serviceId) => {
        const partnerId = await resolvePartnerId(userId);
        const owns = await partner_service_repository_1.partnerServiceRepository.belongsToPartner(serviceId, partnerId);
        if (!owns)
            throw ApiError_1.ApiError.notFound("Service not found or access denied");
        await partner_service_repository_1.partnerServiceRepository.delete(serviceId);
    },
    // ── Admin / Agent read actions ───────────────────────────────────────────────
    listServices: async (query, onlyActive = true) => {
        const params = {
            skip: query.skip,
            take: query.take,
            serviceType: query.serviceType,
            serviceCategory: query.serviceCategory,
            city: query.city,
            selfDrive: query.selfDrive !== undefined ? query.selfDrive === "true" : undefined,
            partnerId: query.partnerId,
            search: query.search,
            onlyActive,
        };
        const [items, total] = await Promise.all([
            partner_service_repository_1.partnerServiceRepository.findMany(params),
            partner_service_repository_1.partnerServiceRepository.count(params),
        ]);
        return { items, total, skip: query.skip ?? 0, take: query.take ?? 20 };
    },
    getService: async (id) => {
        const svc = await partner_service_repository_1.partnerServiceRepository.findById(id);
        if (!svc)
            throw ApiError_1.ApiError.notFound("Partner service not found");
        return svc;
    },
    // ── Admin override ───────────────────────────────────────────────────────────
    adminUpdateService: async (serviceId, data) => {
        await exports.partnerServiceService.getService(serviceId); // ensure exists
        return partner_service_repository_1.partnerServiceRepository.update(serviceId, data);
    },
};
//# sourceMappingURL=partner-service.service.js.map
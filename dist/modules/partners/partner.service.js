"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerService = void 0;
const prisma_1 = require("../../config/prisma");
const partner_repository_1 = require("./partner.repository");
const pagination_1 = require("../../utils/pagination");
const partner_event_repository_1 = require("./partner-event.repository");
const password_1 = require("../../utils/password");
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
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                sort: params?.sort,
                search: params?.search,
            }),
            partner_repository_1.partnerRepository.count({
                status: params?.status,
                approvalStatus: params?.approvalStatus,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                search: params?.search,
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
    /**
     * Partner self-signup (new registration)
     */
    signup: async (data) => {
        // Hash the password
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        // Create User first with PARTNER role
        const user = await prisma_1.prisma.user.create({
            data: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                password: hashedPassword,
                phone: data.phone,
                role: "PARTNER",
                isActive: true,
                emailVerified: false,
            },
        });
        // Create Partner linked to User with PENDING approval status
        const partner = await partner_repository_1.partnerRepository.create({
            userId: user.id,
            businessName: data.businessName,
            website: data.website || null,
            description: data.description,
            isActive: true,
            approvalStatus: "PENDING",
            // Store service selections as JSON arrays
            serviceCategories: data.serviceCategories,
            getAroundServices: data.getAroundServices || [],
            verifiedStaysServices: data.verifiedStaysServices || [],
            liveLikeLocalServices: data.liveLikeLocalServices || [],
            expertAccessServices: data.expertAccessServices || [],
            gearUpServices: data.gearUpServices || [],
            getEntertainedServices: data.getEntertainedServices || [],
        });
        // Create signup event
        await partner_event_repository_1.partnerEventRepository.create({
            partnerId: partner.id,
            type: "APPROVED",
            metadata: {
                source: "SELF_SIGNUP",
                categories: data.serviceCategories,
            },
        });
        // Return partner with user details
        return {
            ...partner,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    },
};
//# sourceMappingURL=partner.service.js.map
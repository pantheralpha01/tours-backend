"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.partnerRepository = {
    create: (data) => prisma_1.prisma.partner.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            isActive: data.isActive ?? true,
            createdById: data.createdById,
        },
        include: { inventory: true, createdBy: true, approvedBy: true },
    }),
    findMany: (params) => {
        const where = {};
        if (params?.status) {
            where.isActive = params.status === "active";
        }
        if (params?.approvalStatus) {
            where.approvalStatus = params.approvalStatus;
        }
        if (params?.createdById) {
            where.createdById = params.createdById;
        }
        if (params?.dateFrom || params?.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        const orderBy = {};
        if (params?.sort) {
            const [field, order] = params.sort.split(":");
            orderBy[field] = order === "asc" ? "asc" : "desc";
        }
        else {
            orderBy.createdAt = "desc";
        }
        return prisma_1.prisma.partner.findMany({
            where,
            orderBy,
            skip: params?.skip,
            take: params?.take,
            include: { inventory: true, createdBy: true, approvedBy: true },
        });
    },
    count: (params) => {
        const where = {};
        if (params?.status) {
            where.isActive = params.status === "active";
        }
        if (params?.approvalStatus) {
            where.approvalStatus = params.approvalStatus;
        }
        if (params?.createdById) {
            where.createdById = params.createdById;
        }
        if (params?.dateFrom || params?.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        return prisma_1.prisma.partner.count({ where });
    },
    findById: (id) => prisma_1.prisma.partner.findUnique({
        where: { id },
        include: { inventory: true, createdBy: true, approvedBy: true },
    }),
    update: (id, data) => prisma_1.prisma.partner.update({
        where: { id },
        data,
        include: { inventory: true, createdBy: true, approvedBy: true },
    }),
    remove: (id) => prisma_1.prisma.partner.delete({ where: { id } }),
};
//# sourceMappingURL=partner.repository.js.map
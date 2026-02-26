"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerInviteRepository = void 0;
const prisma_1 = require("../../config/prisma");
const inviteInclude = {
    partner: {
        select: {
            id: true,
            name: true,
            approvalStatus: true,
            email: true,
        },
    },
    invitedBy: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};
exports.partnerInviteRepository = {
    create: (data) => prisma_1.prisma.partnerInvite.create({
        data,
        include: inviteInclude,
    }),
    findMany: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.invitedById) {
            where.invitedById = params.invitedById;
        }
        if (params?.search) {
            where.OR = [
                { companyName: { contains: params.search, mode: "insensitive" } },
                { email: { contains: params.search, mode: "insensitive" } },
            ];
        }
        return prisma_1.prisma.partnerInvite.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: params?.skip,
            take: params?.take,
            include: inviteInclude,
        });
    },
    count: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.invitedById) {
            where.invitedById = params.invitedById;
        }
        if (params?.search) {
            where.OR = [
                { companyName: { contains: params.search, mode: "insensitive" } },
                { email: { contains: params.search, mode: "insensitive" } },
            ];
        }
        return prisma_1.prisma.partnerInvite.count({ where });
    },
    findByToken: (token) => prisma_1.prisma.partnerInvite.findUnique({
        where: { token },
        include: inviteInclude,
    }),
    findActiveByEmail: (email) => prisma_1.prisma.partnerInvite.findFirst({
        where: {
            email: { equals: email, mode: "insensitive" },
            status: "PENDING",
            expiresAt: { gt: new Date() },
        },
        include: inviteInclude,
    }),
    update: (id, data) => prisma_1.prisma.partnerInvite.update({
        where: { id },
        data,
        include: inviteInclude,
    }),
};
//# sourceMappingURL=partner-invite.repository.js.map
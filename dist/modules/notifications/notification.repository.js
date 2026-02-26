"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRepository = void 0;
const prisma_1 = require("../../config/prisma");
const templateInclude = {
    createdBy: true,
};
const jobInclude = {
    template: true,
    booking: true,
    user: true,
};
exports.notificationRepository = {
    createTemplate: (data) => prisma_1.prisma.notificationTemplate.create({ data, include: templateInclude }),
    listTemplates: (params) => {
        const where = params?.search
            ? {
                OR: [
                    { name: { contains: params.search, mode: "insensitive" } },
                    { slug: { contains: params.search, mode: "insensitive" } },
                ],
            }
            : {};
        return prisma_1.prisma.notificationTemplate.findMany({
            where,
            skip: params?.skip,
            take: params?.take,
            orderBy: { createdAt: "desc" },
            include: templateInclude,
        });
    },
    countTemplates: (params) => {
        const where = params?.search
            ? {
                OR: [
                    { name: { contains: params.search, mode: "insensitive" } },
                    { slug: { contains: params.search, mode: "insensitive" } },
                ],
            }
            : {};
        return prisma_1.prisma.notificationTemplate.count({ where });
    },
    findTemplateBySlug: (slug) => prisma_1.prisma.notificationTemplate.findUnique({ where: { slug }, include: templateInclude }),
    createJob: (data) => prisma_1.prisma.notificationJob.create({ data, include: jobInclude }),
    updateJob: (id, data) => prisma_1.prisma.notificationJob.update({ where: { id }, data, include: jobInclude }),
    findJobById: (id) => prisma_1.prisma.notificationJob.findUnique({ where: { id }, include: jobInclude }),
    listJobs: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.type) {
            where.type = params.type;
        }
        if (params?.search) {
            where.OR = [
                { recipientEmail: { contains: params.search, mode: "insensitive" } },
                { recipientPhone: { contains: params.search, mode: "insensitive" } },
                { recipientName: { contains: params.search, mode: "insensitive" } },
            ];
        }
        return prisma_1.prisma.notificationJob.findMany({
            where,
            skip: params?.skip,
            take: params?.take,
            orderBy: [{ priority: "desc" }, { scheduledAt: "asc" }],
            include: jobInclude,
        });
    },
    countJobs: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.type) {
            where.type = params.type;
        }
        if (params?.search) {
            where.OR = [
                { recipientEmail: { contains: params.search, mode: "insensitive" } },
                { recipientPhone: { contains: params.search, mode: "insensitive" } },
                { recipientName: { contains: params.search, mode: "insensitive" } },
            ];
        }
        return prisma_1.prisma.notificationJob.count({ where });
    },
    findDueJobs: (limit) => prisma_1.prisma.notificationJob.findMany({
        where: {
            status: { in: ["SCHEDULED", "QUEUED"] },
            scheduledAt: { lte: new Date() },
        },
        orderBy: [{ priority: "desc" }, { scheduledAt: "asc" }],
        take: limit,
        include: jobInclude,
    }),
    logAttempt: (data) => prisma_1.prisma.notificationAttempt.create({ data }),
};
//# sourceMappingURL=notification.repository.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offerRepository = void 0;
const prisma_1 = require("../../config/prisma");
const templateInclude = {
    createdBy: true,
    mediaAssets: true,
};
const proposalInclude = {
    booking: true,
    template: true,
    assets: true,
    approvedBy: true,
    publishedBy: true,
};
exports.offerRepository = {
    createTemplate: (data) => prisma_1.prisma.offerTemplate.create({ data, include: templateInclude }),
    updateTemplate: (id, data) => prisma_1.prisma.offerTemplate.update({ where: { id }, data, include: templateInclude }),
    listTemplates: (params) => {
        const where = params?.search
            ? {
                OR: [
                    { name: { contains: params.search, mode: "insensitive" } },
                    { slug: { contains: params.search, mode: "insensitive" } },
                ],
            }
            : {};
        return prisma_1.prisma.offerTemplate.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: params?.skip,
            take: params?.take,
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
        return prisma_1.prisma.offerTemplate.count({ where });
    },
    findTemplateById: (id) => prisma_1.prisma.offerTemplate.findUnique({ where: { id }, include: templateInclude }),
    findTemplateBySlug: (slug) => prisma_1.prisma.offerTemplate.findUnique({ where: { slug }, include: templateInclude }),
    createProposal: (data) => prisma_1.prisma.offerProposal.create({ data, include: proposalInclude }),
    listProposals: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.bookingId) {
            where.bookingId = params.bookingId;
        }
        if (params?.search) {
            where.OR = [
                { notes: { contains: params.search, mode: "insensitive" } },
                { booking: { customerName: { contains: params.search, mode: "insensitive" } } },
            ];
        }
        return prisma_1.prisma.offerProposal.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: params?.skip,
            take: params?.take,
            include: proposalInclude,
        });
    },
    countProposals: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.bookingId) {
            where.bookingId = params.bookingId;
        }
        if (params?.search) {
            where.OR = [
                { notes: { contains: params.search, mode: "insensitive" } },
                { booking: { customerName: { contains: params.search, mode: "insensitive" } } },
            ];
        }
        return prisma_1.prisma.offerProposal.count({ where });
    },
    findProposalById: (id) => prisma_1.prisma.offerProposal.findUnique({ where: { id }, include: proposalInclude }),
    findLatestProposalForBooking: (bookingId) => prisma_1.prisma.offerProposal.findFirst({
        where: { bookingId },
        orderBy: { createdAt: "desc" },
        include: proposalInclude,
    }),
};
//# sourceMappingURL=offer.repository.js.map
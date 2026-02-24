import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

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

export const offerRepository = {
  createTemplate: (data: Prisma.OfferTemplateCreateInput) =>
    prisma.offerTemplate.create({ data, include: templateInclude }),

  updateTemplate: (id: string, data: Prisma.OfferTemplateUpdateInput) =>
    prisma.offerTemplate.update({ where: { id }, data, include: templateInclude }),

  listTemplates: (params?: { skip?: number; take?: number; search?: string }) => {
    const where: Prisma.OfferTemplateWhereInput = params?.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { slug: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {};

    return prisma.offerTemplate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: params?.skip,
      take: params?.take,
      include: templateInclude,
    });
  },

  countTemplates: (params?: { search?: string }) => {
    const where: Prisma.OfferTemplateWhereInput = params?.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { slug: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {};

    return prisma.offerTemplate.count({ where });
  },

  findTemplateById: (id: string) =>
    prisma.offerTemplate.findUnique({ where: { id }, include: templateInclude }),

  findTemplateBySlug: (slug: string) =>
    prisma.offerTemplate.findUnique({ where: { slug }, include: templateInclude }),

  createProposal: (data: Prisma.OfferProposalCreateInput) =>
    prisma.offerProposal.create({ data, include: proposalInclude }),

  listProposals: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    bookingId?: string;
    search?: string;
  }) => {
    const where: Prisma.OfferProposalWhereInput = {};

    if (params?.status) {
      where.status = params.status as Prisma.OfferProposalWhereInput["status"];
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

    return prisma.offerProposal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: params?.skip,
      take: params?.take,
      include: proposalInclude,
    });
  },

  countProposals: (params?: { status?: string; bookingId?: string; search?: string }) => {
    const where: Prisma.OfferProposalWhereInput = {};

    if (params?.status) {
      where.status = params.status as Prisma.OfferProposalWhereInput["status"];
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

    return prisma.offerProposal.count({ where });
  },

  findProposalById: (id: string) =>
    prisma.offerProposal.findUnique({ where: { id }, include: proposalInclude }),
  
    findLatestProposalForBooking: (bookingId: string) =>
      prisma.offerProposal.findFirst({
        where: { bookingId },
        orderBy: { createdAt: "desc" },
        include: proposalInclude,
      }),
};

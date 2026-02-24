import { PartnerInviteStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

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
} satisfies Prisma.PartnerInviteInclude;

export type PartnerInviteWithRelations = Prisma.PartnerInviteGetPayload<{
  include: typeof inviteInclude;
}>;

export const partnerInviteRepository = {
  create: (data: Prisma.PartnerInviteCreateInput) =>
    prisma.partnerInvite.create({
      data,
      include: inviteInclude,
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    status?: PartnerInviteStatus;
    invitedById?: string;
    search?: string;
  }) => {
    const where: Prisma.PartnerInviteWhereInput = {};
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

    return prisma.partnerInvite.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: params?.skip,
      take: params?.take,
      include: inviteInclude,
    });
  },

  count: (params?: {
    status?: PartnerInviteStatus;
    invitedById?: string;
    search?: string;
  }) => {
    const where: Prisma.PartnerInviteWhereInput = {};
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
    return prisma.partnerInvite.count({ where });
  },

  findByToken: (token: string) =>
    prisma.partnerInvite.findUnique({
      where: { token },
      include: inviteInclude,
    }),

  findActiveByEmail: (email: string) =>
    prisma.partnerInvite.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      include: inviteInclude,
    }),

  update: (id: string, data: Prisma.PartnerInviteUpdateInput) =>
    prisma.partnerInvite.update({
      where: { id },
      data,
      include: inviteInclude,
    }),
};

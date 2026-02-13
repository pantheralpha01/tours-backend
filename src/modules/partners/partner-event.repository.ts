import { prisma } from "../../config/prisma";
import { PartnerEventType, Prisma } from "@prisma/client";

export const partnerEventRepository = {
  create: (data: {
    partnerId: string;
    type: PartnerEventType;
    actorId?: string;
    metadata?: Prisma.JsonValue;
  }) =>
    prisma.partnerEvent.create({
      data: {
        partnerId: data.partnerId,
        type: data.type,
        actorId: data.actorId,
        metadata: (data.metadata || undefined) as any,
      },
    }),

  findMany: (params: {
    partnerId: string;
    type?: PartnerEventType;
    skip?: number;
    take?: number;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
  }) => {
    const where: any = { partnerId: params.partnerId };
    if (params.type) {
      where.type = params.type;
    }
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }

    const orderBy: any = {};
    if (params.sort) {
      const [field, order] = params.sort.split(":");
      orderBy[field] = order === "asc" ? "asc" : "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    return prisma.partnerEvent.findMany({
      where,
      orderBy,
      skip: params.skip,
      take: params.take,
    });
  },

  count: (params: {
    partnerId: string;
    type?: PartnerEventType;
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    const where: any = { partnerId: params.partnerId };
    if (params.type) {
      where.type = params.type;
    }
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }
    return prisma.partnerEvent.count({ where });
  },
};

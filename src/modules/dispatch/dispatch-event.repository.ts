import { prisma } from "../../config/prisma";
import { DispatchEventType, Prisma } from "@prisma/client";

export const dispatchEventRepository = {
  create: (data: {
    dispatchId: string;
    type: DispatchEventType;
    actorId?: string;
    metadata?: Prisma.JsonValue;
  }) =>
    prisma.dispatchEvent.create({
      data: {
        dispatchId: data.dispatchId,
        type: data.type,
        actorId: data.actorId,
        metadata: (data.metadata || undefined) as any,
      },
    }),

  findMany: (params: {
    dispatchId: string;
    dateFrom?: Date;
    dateTo?: Date;
    take?: number;
  }) => {
    const where: any = { dispatchId: params.dispatchId };
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }

    return prisma.dispatchEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: params.take,
    });
  },
};

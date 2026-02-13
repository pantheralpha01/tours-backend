import { prisma } from "../../config/prisma";

export const dispatchTrackRepository = {
  create: (data: {
    dispatchId: string;
    latitude: number;
    longitude: number;
    recordedAt?: Date;
    metadata?: Record<string, unknown>;
  }) =>
    prisma.dispatchTrackPoint.create({
      data: {
        dispatchId: data.dispatchId,
        latitude: data.latitude,
        longitude: data.longitude,
        recordedAt: data.recordedAt ?? new Date(),
        metadata: data.metadata ? (data.metadata as any) : null,
      },
    }),

  findMany: (params: {
    dispatchId: string;
    skip?: number;
    take?: number;
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    const where: any = { dispatchId: params.dispatchId };
    if (params.dateFrom || params.dateTo) {
      where.recordedAt = {};
      if (params.dateFrom) where.recordedAt.gte = params.dateFrom;
      if (params.dateTo) where.recordedAt.lte = params.dateTo;
    }

    return prisma.dispatchTrackPoint.findMany({
      where,
      orderBy: { recordedAt: "desc" },
      skip: params.skip,
      take: params.take,
    });
  },

  count: (params: { dispatchId: string; dateFrom?: Date; dateTo?: Date }) => {
    const where: any = { dispatchId: params.dispatchId };
    if (params.dateFrom || params.dateTo) {
      where.recordedAt = {};
      if (params.dateFrom) where.recordedAt.gte = params.dateFrom;
      if (params.dateTo) where.recordedAt.lte = params.dateTo;
    }

    return prisma.dispatchTrackPoint.count({ where });
  },
};

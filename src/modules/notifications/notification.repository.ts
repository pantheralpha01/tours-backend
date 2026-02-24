import { NotificationStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

const templateInclude = {
  createdBy: true,
};

const jobInclude = {
  template: true,
  booking: true,
  user: true,
};

export const notificationRepository = {
  createTemplate: (data: Prisma.NotificationTemplateCreateInput) =>
    prisma.notificationTemplate.create({ data, include: templateInclude }),

  listTemplates: (params?: { skip?: number; take?: number; search?: string }) => {
    const where: Prisma.NotificationTemplateWhereInput = params?.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { slug: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {};

    return prisma.notificationTemplate.findMany({
      where,
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: "desc" },
      include: templateInclude,
    });
  },

  countTemplates: (params?: { search?: string }) => {
    const where: Prisma.NotificationTemplateWhereInput = params?.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { slug: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {};

    return prisma.notificationTemplate.count({ where });
  },

  findTemplateBySlug: (slug: string) =>
    prisma.notificationTemplate.findUnique({ where: { slug }, include: templateInclude }),

  createJob: (data: Prisma.NotificationJobCreateInput) =>
    prisma.notificationJob.create({ data, include: jobInclude }),

  updateJob: (id: string, data: Prisma.NotificationJobUpdateInput) =>
    prisma.notificationJob.update({ where: { id }, data, include: jobInclude }),

  findJobById: (id: string) =>
    prisma.notificationJob.findUnique({ where: { id }, include: jobInclude }),

  listJobs: (params?: {
    skip?: number;
    take?: number;
    status?: NotificationStatus;
    type?: string;
    search?: string;
  }) => {
    const where: Prisma.NotificationJobWhereInput = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.type) {
      where.type = params.type as any;
    }

    if (params?.search) {
      where.OR = [
        { recipientEmail: { contains: params.search, mode: "insensitive" } },
        { recipientPhone: { contains: params.search, mode: "insensitive" } },
        { recipientName: { contains: params.search, mode: "insensitive" } },
      ];
    }

    return prisma.notificationJob.findMany({
      where,
      skip: params?.skip,
      take: params?.take,
      orderBy: [{ priority: "desc" }, { scheduledAt: "asc" }],
      include: jobInclude,
    });
  },

  countJobs: (params?: { status?: NotificationStatus; type?: string; search?: string }) => {
    const where: Prisma.NotificationJobWhereInput = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.type) {
      where.type = params.type as any;
    }

    if (params?.search) {
      where.OR = [
        { recipientEmail: { contains: params.search, mode: "insensitive" } },
        { recipientPhone: { contains: params.search, mode: "insensitive" } },
        { recipientName: { contains: params.search, mode: "insensitive" } },
      ];
    }

    return prisma.notificationJob.count({ where });
  },

  findDueJobs: (limit: number) =>
    prisma.notificationJob.findMany({
      where: {
        status: { in: ["SCHEDULED", "QUEUED"] },
        scheduledAt: { lte: new Date() },
      },
      orderBy: [{ priority: "desc" }, { scheduledAt: "asc" }],
      take: limit,
      include: jobInclude,
    }),

  logAttempt: (data: Prisma.NotificationAttemptCreateInput) =>
    prisma.notificationAttempt.create({ data }),
};

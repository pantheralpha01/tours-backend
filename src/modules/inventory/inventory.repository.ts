import { prisma } from "../../config/prisma";

export const inventoryRepository = {
  create: (data: {
    partnerId: string;
    title: string;
    description?: string;
    price: number;
    status?: "DRAFT" | "ACTIVE" | "INACTIVE";
  }) =>
    prisma.inventoryItem.create({
      data: {
        partnerId: data.partnerId,
        title: data.title,
        description: data.description,
        price: data.price,
        status: data.status ?? "DRAFT",
      },
      include: { partner: true },
    }),

  findMany: (params?: { createdById?: string }) => {
    const where: any = {};
    if (params?.createdById) {
      where.partner = { createdById: params.createdById };
    }

    return prisma.inventoryItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { partner: true },
    });
  },

  findById: (id: string) =>
    prisma.inventoryItem.findUnique({ where: { id }, include: { partner: true } }),

  update: (
    id: string,
    data: {
      partnerId?: string;
      title?: string;
      description?: string;
      price?: number;
      status?: "DRAFT" | "ACTIVE" | "INACTIVE";
    }
  ) =>
    prisma.inventoryItem.update({
      where: { id },
      data,
      include: { partner: true },
    }),

  remove: (id: string) => prisma.inventoryItem.delete({ where: { id } }),
};

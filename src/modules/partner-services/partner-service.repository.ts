import { prisma } from "../../config/prisma";
import { CreatePartnerServiceInput, UpdatePartnerServiceInput } from "./partner-service.validation";

export const partnerServiceRepository = {
  create: async (partnerId: string, data: CreatePartnerServiceInput) => {
    const { cities, ...rest } = data;
    return prisma.partnerService.create({
      data: {
        partnerId,
        serviceCategory: rest.serviceCategory,
        serviceType: rest.serviceType,
        description: rest.description,
        carType: rest.carType,
        selfDrive: rest.selfDrive,
        boatCapacity: rest.boatCapacity,
        cuisine: rest.cuisine,
        priceFrom: rest.priceFrom,
        currency: rest.currency ?? "KES",
        isActive: rest.isActive ?? true,
        cities: {
          create: cities.map((city) => ({ city })),
        },
      },
      include: { cities: true, partner: { include: { user: { select: { name: true, phone: true } } } } },
    });
  },

  findById: (id: string) =>
    prisma.partnerService.findUnique({
      where: { id },
      include: {
        cities: true,
        partner: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
          },
        },
      },
    }),

  findMany: (params: {
    skip?: number;
    take?: number;
    serviceType?: string;
    serviceCategory?: string;
    city?: string;
    selfDrive?: boolean;
    partnerId?: string;
    search?: string;
    onlyActive?: boolean;
  }) => {
    const where: any = {};

    if (params.onlyActive !== false) where.isActive = true;
    if (params.serviceType) where.serviceType = params.serviceType;
    if (params.serviceCategory) where.serviceCategory = params.serviceCategory;
    if (params.partnerId) where.partnerId = params.partnerId;
    if (params.selfDrive !== undefined) where.selfDrive = params.selfDrive;

    if (params.city) {
      where.cities = { some: { city: params.city } };
    }

    if (params.search) {
      where.OR = [
        { description: { contains: params.search, mode: "insensitive" } },
        { carType: { contains: params.search, mode: "insensitive" } },
        { cuisine: { contains: params.search, mode: "insensitive" } },
        { partner: { businessName: { contains: params.search, mode: "insensitive" } } },
        { partner: { user: { name: { contains: params.search, mode: "insensitive" } } } },
      ];
    }

    return prisma.partnerService.findMany({
      where,
      skip: params.skip ?? 0,
      take: params.take ?? 20,
      orderBy: { createdAt: "desc" },
      include: {
        cities: true,
        partner: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
          },
        },
      },
    });
  },

  count: (params: {
    serviceType?: string;
    serviceCategory?: string;
    city?: string;
    selfDrive?: boolean;
    partnerId?: string;
    search?: string;
    onlyActive?: boolean;
  }) => {
    const where: any = {};
    if (params.onlyActive !== false) where.isActive = true;
    if (params.serviceType) where.serviceType = params.serviceType;
    if (params.serviceCategory) where.serviceCategory = params.serviceCategory;
    if (params.partnerId) where.partnerId = params.partnerId;
    if (params.selfDrive !== undefined) where.selfDrive = params.selfDrive;
    if (params.city) where.cities = { some: { city: params.city } };
    if (params.search) {
      where.OR = [
        { description: { contains: params.search, mode: "insensitive" } },
        { carType: { contains: params.search, mode: "insensitive" } },
        { partner: { businessName: { contains: params.search, mode: "insensitive" } } },
      ];
    }
    return prisma.partnerService.count({ where });
  },

  update: async (id: string, data: UpdatePartnerServiceInput) => {
    const { cities, ...rest } = data;

    return prisma.$transaction(async (tx) => {
      if (cities !== undefined) {
        await tx.partnerServiceCity.deleteMany({ where: { partnerServiceId: id } });
      }
      return tx.partnerService.update({
        where: { id },
        data: {
          ...rest,
          ...(cities !== undefined
            ? { cities: { create: cities.map((city) => ({ city })) } }
            : {}),
        },
        include: { cities: true, partner: { include: { user: { select: { name: true, phone: true } } } } },
      });
    });
  },

  delete: (id: string) =>
    prisma.partnerService.delete({ where: { id } }),

  belongsToPartner: async (serviceId: string, partnerId: string): Promise<boolean> => {
    const svc = await prisma.partnerService.findFirst({ where: { id: serviceId, partnerId } });
    return !!svc;
  },
};

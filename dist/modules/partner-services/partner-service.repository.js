"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerServiceRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.partnerServiceRepository = {
    create: async (partnerId, data) => {
        const { cities, ...rest } = data;
        return prisma_1.prisma.partnerService.create({
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
    findById: (id) => prisma_1.prisma.partnerService.findUnique({
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
    findMany: (params) => {
        const where = {};
        if (params.onlyActive !== false)
            where.isActive = true;
        if (params.serviceType)
            where.serviceType = params.serviceType;
        if (params.serviceCategory)
            where.serviceCategory = params.serviceCategory;
        if (params.partnerId)
            where.partnerId = params.partnerId;
        if (params.selfDrive !== undefined)
            where.selfDrive = params.selfDrive;
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
        return prisma_1.prisma.partnerService.findMany({
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
    count: (params) => {
        const where = {};
        if (params.onlyActive !== false)
            where.isActive = true;
        if (params.serviceType)
            where.serviceType = params.serviceType;
        if (params.serviceCategory)
            where.serviceCategory = params.serviceCategory;
        if (params.partnerId)
            where.partnerId = params.partnerId;
        if (params.selfDrive !== undefined)
            where.selfDrive = params.selfDrive;
        if (params.city)
            where.cities = { some: { city: params.city } };
        if (params.search) {
            where.OR = [
                { description: { contains: params.search, mode: "insensitive" } },
                { carType: { contains: params.search, mode: "insensitive" } },
                { partner: { businessName: { contains: params.search, mode: "insensitive" } } },
            ];
        }
        return prisma_1.prisma.partnerService.count({ where });
    },
    update: async (id, data) => {
        const { cities, ...rest } = data;
        return prisma_1.prisma.$transaction(async (tx) => {
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
    delete: (id) => prisma_1.prisma.partnerService.delete({ where: { id } }),
    belongsToPartner: async (serviceId, partnerId) => {
        const svc = await prisma_1.prisma.partnerService.findFirst({ where: { id: serviceId, partnerId } });
        return !!svc;
    },
};
//# sourceMappingURL=partner-service.repository.js.map
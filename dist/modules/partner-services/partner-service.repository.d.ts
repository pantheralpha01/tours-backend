import { CreatePartnerServiceInput, UpdatePartnerServiceInput } from "./partner-service.validation";
export declare const partnerServiceRepository: {
    create: (partnerId: string, data: CreatePartnerServiceInput) => Promise<{
        partner: {
            user: {
                name: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            businessName: string | null;
            website: string | null;
            approvalStatus: import(".prisma/client").$Enums.PartnerApprovalStatus;
            approvedById: string | null;
            approvedAt: Date | null;
            rejectedReason: string | null;
            serviceCategories: string[];
            getAroundServices: string[];
            verifiedStaysServices: string[];
            liveLikeLocalServices: string[];
            expertAccessServices: string[];
            gearUpServices: string[];
            getEntertainedServices: string[];
        };
        cities: {
            id: string;
            partnerServiceId: string;
            city: import(".prisma/client").$Enums.City;
        }[];
    } & {
        id: string;
        isActive: boolean;
        partnerId: string;
        createdAt: Date;
        updatedAt: Date;
        currency: import(".prisma/client").$Enums.Currency;
        description: string | null;
        serviceCategory: import(".prisma/client").$Enums.PartnerServiceCategory;
        serviceType: import(".prisma/client").$Enums.PartnerServiceType;
        carType: string | null;
        selfDrive: boolean | null;
        boatCapacity: number | null;
        cuisine: string | null;
        priceFrom: import("@prisma/client-runtime-utils").Decimal | null;
    }>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__PartnerServiceClient<({
        partner: {
            user: {
                name: string;
                id: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            businessName: string | null;
            website: string | null;
            approvalStatus: import(".prisma/client").$Enums.PartnerApprovalStatus;
            approvedById: string | null;
            approvedAt: Date | null;
            rejectedReason: string | null;
            serviceCategories: string[];
            getAroundServices: string[];
            verifiedStaysServices: string[];
            liveLikeLocalServices: string[];
            expertAccessServices: string[];
            gearUpServices: string[];
            getEntertainedServices: string[];
        };
        cities: {
            id: string;
            partnerServiceId: string;
            city: import(".prisma/client").$Enums.City;
        }[];
    } & {
        id: string;
        isActive: boolean;
        partnerId: string;
        createdAt: Date;
        updatedAt: Date;
        currency: import(".prisma/client").$Enums.Currency;
        description: string | null;
        serviceCategory: import(".prisma/client").$Enums.PartnerServiceCategory;
        serviceType: import(".prisma/client").$Enums.PartnerServiceType;
        carType: string | null;
        selfDrive: boolean | null;
        boatCapacity: number | null;
        cuisine: string | null;
        priceFrom: import("@prisma/client-runtime-utils").Decimal | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
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
    }) => import(".prisma/client").Prisma.PrismaPromise<({
        partner: {
            user: {
                name: string;
                id: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            businessName: string | null;
            website: string | null;
            approvalStatus: import(".prisma/client").$Enums.PartnerApprovalStatus;
            approvedById: string | null;
            approvedAt: Date | null;
            rejectedReason: string | null;
            serviceCategories: string[];
            getAroundServices: string[];
            verifiedStaysServices: string[];
            liveLikeLocalServices: string[];
            expertAccessServices: string[];
            gearUpServices: string[];
            getEntertainedServices: string[];
        };
        cities: {
            id: string;
            partnerServiceId: string;
            city: import(".prisma/client").$Enums.City;
        }[];
    } & {
        id: string;
        isActive: boolean;
        partnerId: string;
        createdAt: Date;
        updatedAt: Date;
        currency: import(".prisma/client").$Enums.Currency;
        description: string | null;
        serviceCategory: import(".prisma/client").$Enums.PartnerServiceCategory;
        serviceType: import(".prisma/client").$Enums.PartnerServiceType;
        carType: string | null;
        selfDrive: boolean | null;
        boatCapacity: number | null;
        cuisine: string | null;
        priceFrom: import("@prisma/client-runtime-utils").Decimal | null;
    })[]>;
    count: (params: {
        serviceType?: string;
        serviceCategory?: string;
        city?: string;
        selfDrive?: boolean;
        partnerId?: string;
        search?: string;
        onlyActive?: boolean;
    }) => import(".prisma/client").Prisma.PrismaPromise<number>;
    update: (id: string, data: UpdatePartnerServiceInput) => Promise<{
        partner: {
            user: {
                name: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            businessName: string | null;
            website: string | null;
            approvalStatus: import(".prisma/client").$Enums.PartnerApprovalStatus;
            approvedById: string | null;
            approvedAt: Date | null;
            rejectedReason: string | null;
            serviceCategories: string[];
            getAroundServices: string[];
            verifiedStaysServices: string[];
            liveLikeLocalServices: string[];
            expertAccessServices: string[];
            gearUpServices: string[];
            getEntertainedServices: string[];
        };
        cities: {
            id: string;
            partnerServiceId: string;
            city: import(".prisma/client").$Enums.City;
        }[];
    } & {
        id: string;
        isActive: boolean;
        partnerId: string;
        createdAt: Date;
        updatedAt: Date;
        currency: import(".prisma/client").$Enums.Currency;
        description: string | null;
        serviceCategory: import(".prisma/client").$Enums.PartnerServiceCategory;
        serviceType: import(".prisma/client").$Enums.PartnerServiceType;
        carType: string | null;
        selfDrive: boolean | null;
        boatCapacity: number | null;
        cuisine: string | null;
        priceFrom: import("@prisma/client-runtime-utils").Decimal | null;
    }>;
    delete: (id: string) => import(".prisma/client").Prisma.Prisma__PartnerServiceClient<{
        id: string;
        isActive: boolean;
        partnerId: string;
        createdAt: Date;
        updatedAt: Date;
        currency: import(".prisma/client").$Enums.Currency;
        description: string | null;
        serviceCategory: import(".prisma/client").$Enums.PartnerServiceCategory;
        serviceType: import(".prisma/client").$Enums.PartnerServiceType;
        carType: string | null;
        selfDrive: boolean | null;
        boatCapacity: number | null;
        cuisine: string | null;
        priceFrom: import("@prisma/client-runtime-utils").Decimal | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    belongsToPartner: (serviceId: string, partnerId: string) => Promise<boolean>;
};
//# sourceMappingURL=partner-service.repository.d.ts.map
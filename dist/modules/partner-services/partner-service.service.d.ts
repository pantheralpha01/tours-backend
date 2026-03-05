import { CreatePartnerServiceInput, ListPartnerServicesQuery, UpdatePartnerServiceInput } from "./partner-service.validation";
export declare const partnerServiceService: {
    createService: (userId: string, data: CreatePartnerServiceInput) => Promise<{
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
    updateService: (userId: string, serviceId: string, data: UpdatePartnerServiceInput) => Promise<{
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
    deleteService: (userId: string, serviceId: string) => Promise<void>;
    listServices: (query: ListPartnerServicesQuery, onlyActive?: boolean) => Promise<{
        items: ({
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
        })[];
        total: number;
        skip: number;
        take: number;
    }>;
    getService: (id: string) => Promise<{
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
    }>;
    adminUpdateService: (serviceId: string, data: UpdatePartnerServiceInput) => Promise<{
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
};
//# sourceMappingURL=partner-service.service.d.ts.map
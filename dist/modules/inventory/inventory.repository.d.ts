export declare const inventoryRepository: {
    create: (data: {
        partnerId: string;
        title: string;
        description?: string;
        price: number;
        status?: "DRAFT" | "ACTIVE" | "INACTIVE";
    }) => import(".prisma/client").Prisma.Prisma__InventoryItemClient<{
        partner: {
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
    } & {
        id: string;
        partnerId: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InventoryStatus;
        title: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findMany: (params?: {
        createdById?: string;
    }) => import(".prisma/client").Prisma.PrismaPromise<({
        partner: {
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
    } & {
        id: string;
        partnerId: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InventoryStatus;
        title: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
    })[]>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__InventoryItemClient<({
        partner: {
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
    } & {
        id: string;
        partnerId: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InventoryStatus;
        title: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        partnerId?: string;
        title?: string;
        description?: string;
        price?: number;
        status?: "DRAFT" | "ACTIVE" | "INACTIVE";
    }) => import(".prisma/client").Prisma.Prisma__InventoryItemClient<{
        partner: {
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
    } & {
        id: string;
        partnerId: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InventoryStatus;
        title: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__InventoryItemClient<{
        id: string;
        partnerId: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InventoryStatus;
        title: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=inventory.repository.d.ts.map
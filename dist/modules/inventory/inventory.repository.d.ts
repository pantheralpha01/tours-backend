export declare const inventoryRepository: {
    create: (data: {
        partnerId: string;
        title: string;
        description?: string;
        price: number;
        status?: "DRAFT" | "ACTIVE" | "INACTIVE";
    }) => import(".prisma/client").Prisma.Prisma__InventoryItemClient<{
        partner: {
            name: string;
            id: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            phone: string | null;
            approvalStatus: import(".prisma/client").$Enums.PartnerApprovalStatus;
            approvedById: string | null;
            approvedAt: Date | null;
            rejectedReason: string | null;
            createdById: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InventoryStatus;
        title: string;
        description: string | null;
        partnerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findMany: (params?: {
        createdById?: string;
    }) => import(".prisma/client").Prisma.PrismaPromise<({
        partner: {
            name: string;
            id: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            phone: string | null;
            approvalStatus: import(".prisma/client").$Enums.PartnerApprovalStatus;
            approvedById: string | null;
            approvedAt: Date | null;
            rejectedReason: string | null;
            createdById: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InventoryStatus;
        title: string;
        description: string | null;
        partnerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__InventoryItemClient<({
        partner: {
            name: string;
            id: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            phone: string | null;
            approvalStatus: import(".prisma/client").$Enums.PartnerApprovalStatus;
            approvedById: string | null;
            approvedAt: Date | null;
            rejectedReason: string | null;
            createdById: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InventoryStatus;
        title: string;
        description: string | null;
        partnerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        partnerId?: string;
        title?: string;
        description?: string;
        price?: number;
        status?: "DRAFT" | "ACTIVE" | "INACTIVE";
    }) => import(".prisma/client").Prisma.Prisma__InventoryItemClient<{
        partner: {
            name: string;
            id: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            phone: string | null;
            approvalStatus: import(".prisma/client").$Enums.PartnerApprovalStatus;
            approvedById: string | null;
            approvedAt: Date | null;
            rejectedReason: string | null;
            createdById: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InventoryStatus;
        title: string;
        description: string | null;
        partnerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__InventoryItemClient<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InventoryStatus;
        title: string;
        description: string | null;
        partnerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=inventory.repository.d.ts.map
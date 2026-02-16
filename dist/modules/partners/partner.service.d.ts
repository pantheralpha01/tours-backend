import { PaginatedResponse } from "../../utils/pagination";
export declare const partnerService: {
    create: (data: {
        name: string;
        email?: string;
        phone?: string;
        isActive?: boolean;
        createdById?: string;
    }) => import(".prisma/client").Prisma.Prisma__PartnerClient<{
        inventory: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InventoryStatus;
            title: string;
            description: string | null;
            partnerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
        createdBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
        approvedBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
    } & {
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    list: (params?: {
        page?: number;
        limit?: number;
        status?: string;
        approvalStatus?: string;
        createdById?: string;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
    }) => Promise<PaginatedResponse<any>>;
    getById: (id: string) => import(".prisma/client").Prisma.Prisma__PartnerClient<({
        inventory: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InventoryStatus;
            title: string;
            description: string | null;
            partnerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
        createdBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
        approvedBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
    } & {
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        name?: string;
        email?: string;
        phone?: string;
        isActive?: boolean;
        approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
        approvedById?: string | null;
        approvedAt?: Date | null;
        rejectedReason?: string | null;
    }) => import(".prisma/client").Prisma.Prisma__PartnerClient<{
        inventory: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InventoryStatus;
            title: string;
            description: string | null;
            partnerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
        createdBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
        approvedBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
    } & {
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    approve: (id: string, approvedById: string) => Promise<{
        inventory: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InventoryStatus;
            title: string;
            description: string | null;
            partnerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
        createdBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
        approvedBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
    } & {
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
    }>;
    reject: (id: string, approvedById: string, reason?: string) => Promise<{
        inventory: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InventoryStatus;
            title: string;
            description: string | null;
            partnerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
        createdBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
        approvedBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
    } & {
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
    }>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__PartnerClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=partner.service.d.ts.map
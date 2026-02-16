export declare const contractRepository: {
    create: (data: {
        bookingId: string;
        partnerId?: string;
        status?: "DRAFT" | "SENT" | "SIGNED" | "CANCELLED";
        fileUrl?: string;
        signedAt?: Date;
        metadata?: Record<string, unknown>;
    }) => import(".prisma/client").Prisma.Prisma__ContractClient<{
        booking: {
            id: string;
            createdAt: Date;
            customerName: string;
            serviceTitle: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            commissionRate: import("@prisma/client/runtime/library").Decimal;
            commissionAmount: import("@prisma/client/runtime/library").Decimal;
            commissionCurrency: import(".prisma/client").$Enums.Currency;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            agentId: string;
            serviceStartAt: Date | null;
            serviceEndAt: Date | null;
            serviceTimezone: string | null;
        };
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ContractStatus;
        bookingId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        partnerId: string | null;
        fileUrl: string | null;
        signedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findMany: (params?: {
        skip?: number;
        take?: number;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
        bookingId?: string;
        partnerId?: string;
    }) => import(".prisma/client").Prisma.PrismaPromise<({
        booking: {
            id: string;
            createdAt: Date;
            customerName: string;
            serviceTitle: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            commissionRate: import("@prisma/client/runtime/library").Decimal;
            commissionAmount: import("@prisma/client/runtime/library").Decimal;
            commissionCurrency: import(".prisma/client").$Enums.Currency;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            agentId: string;
            serviceStartAt: Date | null;
            serviceEndAt: Date | null;
            serviceTimezone: string | null;
        };
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ContractStatus;
        bookingId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        partnerId: string | null;
        fileUrl: string | null;
        signedAt: Date | null;
    })[]>;
    count: (params?: {
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        bookingId?: string;
        partnerId?: string;
    }) => import(".prisma/client").Prisma.PrismaPromise<number>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__ContractClient<({
        booking: {
            id: string;
            createdAt: Date;
            customerName: string;
            serviceTitle: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            commissionRate: import("@prisma/client/runtime/library").Decimal;
            commissionAmount: import("@prisma/client/runtime/library").Decimal;
            commissionCurrency: import(".prisma/client").$Enums.Currency;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            agentId: string;
            serviceStartAt: Date | null;
            serviceEndAt: Date | null;
            serviceTimezone: string | null;
        };
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ContractStatus;
        bookingId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        partnerId: string | null;
        fileUrl: string | null;
        signedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        partnerId?: string;
        status?: "DRAFT" | "SENT" | "SIGNED" | "CANCELLED";
        fileUrl?: string;
        signedAt?: Date;
        metadata?: Record<string, unknown>;
    }) => import(".prisma/client").Prisma.Prisma__ContractClient<{
        booking: {
            id: string;
            createdAt: Date;
            customerName: string;
            serviceTitle: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            commissionRate: import("@prisma/client/runtime/library").Decimal;
            commissionAmount: import("@prisma/client/runtime/library").Decimal;
            commissionCurrency: import(".prisma/client").$Enums.Currency;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            agentId: string;
            serviceStartAt: Date | null;
            serviceEndAt: Date | null;
            serviceTimezone: string | null;
        };
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ContractStatus;
        bookingId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        partnerId: string | null;
        fileUrl: string | null;
        signedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__ContractClient<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ContractStatus;
        bookingId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        partnerId: string | null;
        fileUrl: string | null;
        signedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=contract.repository.d.ts.map
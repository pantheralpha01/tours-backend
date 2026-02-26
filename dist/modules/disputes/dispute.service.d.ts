import { PaginatedResponse } from "../../utils/pagination";
export declare const disputeService: {
    create: (data: {
        bookingId: string;
        reason: string;
        description?: string;
        openedById: string;
        assignedToId?: string;
    }) => Promise<{
        booking: {
            id: string;
            createdAt: Date;
            customerName: string;
            serviceTitle: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            commissionRate: import("@prisma/client-runtime-utils").Decimal;
            commissionAmount: import("@prisma/client-runtime-utils").Decimal;
            commissionCurrency: import(".prisma/client").$Enums.Currency;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            splitPaymentEnabled: boolean;
            depositPercentage: import("@prisma/client-runtime-utils").Decimal | null;
            depositAmount: import("@prisma/client-runtime-utils").Decimal | null;
            depositDueDate: Date | null;
            balanceAmount: import("@prisma/client-runtime-utils").Decimal | null;
            balanceDueDate: Date | null;
            splitPaymentNotes: string | null;
            agentId: string;
            serviceStartAt: Date | null;
            serviceEndAt: Date | null;
            serviceTimezone: string | null;
        };
        assignedTo: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
        openedBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        description: string | null;
        openedById: string;
        assignedToId: string | null;
        resolvedAt: Date | null;
    }>;
    list: (params?: {
        page?: number;
        limit?: number;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
        bookingId?: string;
        openedById?: string;
        assignedToId?: string;
    }) => Promise<PaginatedResponse<any>>;
    getById: (id: string) => import(".prisma/client").Prisma.Prisma__DisputeClient<({
        booking: {
            id: string;
            createdAt: Date;
            customerName: string;
            serviceTitle: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            commissionRate: import("@prisma/client-runtime-utils").Decimal;
            commissionAmount: import("@prisma/client-runtime-utils").Decimal;
            commissionCurrency: import(".prisma/client").$Enums.Currency;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            splitPaymentEnabled: boolean;
            depositPercentage: import("@prisma/client-runtime-utils").Decimal | null;
            depositAmount: import("@prisma/client-runtime-utils").Decimal | null;
            depositDueDate: Date | null;
            balanceAmount: import("@prisma/client-runtime-utils").Decimal | null;
            balanceDueDate: Date | null;
            splitPaymentNotes: string | null;
            agentId: string;
            serviceStartAt: Date | null;
            serviceEndAt: Date | null;
            serviceTimezone: string | null;
        };
        assignedTo: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
        openedBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        description: string | null;
        openedById: string;
        assignedToId: string | null;
        resolvedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        status?: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
        reason?: string;
        description?: string;
        assignedToId?: string;
        resolvedAt?: Date;
        transitionReason?: string;
    }) => Promise<{
        booking: {
            id: string;
            createdAt: Date;
            customerName: string;
            serviceTitle: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            commissionRate: import("@prisma/client-runtime-utils").Decimal;
            commissionAmount: import("@prisma/client-runtime-utils").Decimal;
            commissionCurrency: import(".prisma/client").$Enums.Currency;
            status: import(".prisma/client").$Enums.BookingStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            splitPaymentEnabled: boolean;
            depositPercentage: import("@prisma/client-runtime-utils").Decimal | null;
            depositAmount: import("@prisma/client-runtime-utils").Decimal | null;
            depositDueDate: Date | null;
            balanceAmount: import("@prisma/client-runtime-utils").Decimal | null;
            balanceDueDate: Date | null;
            splitPaymentNotes: string | null;
            agentId: string;
            serviceStartAt: Date | null;
            serviceEndAt: Date | null;
            serviceTimezone: string | null;
        };
        assignedTo: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        } | null;
        openedBy: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        description: string | null;
        openedById: string;
        assignedToId: string | null;
        resolvedAt: Date | null;
    }>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__DisputeClient<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        description: string | null;
        openedById: string;
        assignedToId: string | null;
        resolvedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=dispute.service.d.ts.map
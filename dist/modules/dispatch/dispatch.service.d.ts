import { PaginatedResponse } from "../../utils/pagination";
export declare const dispatchService: {
    create: (data: {
        bookingId: string;
        assignedToId?: string;
        status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
        notes?: string;
        startedAt?: Date;
        completedAt?: Date;
        actorId?: string;
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
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DispatchStatus;
        bookingId: string;
        notes: string | null;
        assignedToId: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        startedAt: Date | null;
        completedAt: Date | null;
    }>;
    list: (params?: {
        page?: number;
        limit?: number;
        status?: string;
        bookingId?: string;
        assignedToId?: string;
        agentId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
    }) => Promise<PaginatedResponse<any>>;
    getById: (id: string) => import(".prisma/client").Prisma.Prisma__DispatchClient<({
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
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DispatchStatus;
        bookingId: string;
        notes: string | null;
        assignedToId: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        startedAt: Date | null;
        completedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        assignedToId?: string;
        status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
        notes?: string;
        startedAt?: Date;
        completedAt?: Date;
        actorId?: string;
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
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DispatchStatus;
        bookingId: string;
        notes: string | null;
        assignedToId: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        startedAt: Date | null;
        completedAt: Date | null;
    }>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__DispatchClient<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DispatchStatus;
        bookingId: string;
        notes: string | null;
        assignedToId: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        startedAt: Date | null;
        completedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    addTrackPoint: (data: {
        dispatchId: string;
        latitude: number;
        longitude: number;
        recordedAt?: Date;
        metadata?: Record<string, unknown>;
    }) => import(".prisma/client").Prisma.Prisma__DispatchTrackPointClient<{
        id: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        dispatchId: string;
        latitude: import("@prisma/client-runtime-utils").Decimal;
        longitude: import("@prisma/client-runtime-utils").Decimal;
        recordedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    listTrackPoints: (params: {
        dispatchId: string;
        page?: number;
        limit?: number;
        dateFrom?: Date;
        dateTo?: Date;
    }) => Promise<PaginatedResponse<any>>;
    listTimeline: (params: {
        dispatchId: string;
        page?: number;
        limit?: number;
        dateFrom?: Date;
        dateTo?: Date;
    }) => Promise<PaginatedResponse<any>>;
};
//# sourceMappingURL=dispatch.service.d.ts.map
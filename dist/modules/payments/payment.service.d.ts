import { PaginatedResponse } from "../../utils/pagination";
export declare const paymentService: {
    create: (data: {
        bookingId: string;
        provider: "MPESA" | "STRIPE" | "PAYPAL" | "VISA" | "MASTERCARD";
        amount: number;
        currency?: "USD" | "KES";
        reference?: string;
        metadata?: Record<string, unknown>;
    }) => Promise<{
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        bookingId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        provider: string;
        state: import(".prisma/client").$Enums.PaymentState;
        reference: string | null;
    }>;
    list: (params?: {
        page?: number;
        limit?: number;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
    }) => Promise<PaginatedResponse<any>>;
    getById: (id: string) => import(".prisma/client").Prisma.Prisma__PaymentClient<({
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
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        bookingId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        provider: string;
        state: import(".prisma/client").$Enums.PaymentState;
        reference: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        state?: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
        reference?: string;
        metadata?: Record<string, unknown>;
        transitionReason?: string;
    }) => Promise<{
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
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        bookingId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        provider: string;
        state: import(".prisma/client").$Enums.PaymentState;
        reference: string | null;
    }>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__PaymentClient<{
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        bookingId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        provider: string;
        state: import(".prisma/client").$Enums.PaymentState;
        reference: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=payment.service.d.ts.map
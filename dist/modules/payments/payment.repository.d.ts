import { PaymentState } from "@prisma/client";
export declare const paymentRepository: {
    create: (data: {
        bookingId: string;
        provider: string;
        amount: number;
        currency?: "USD" | "KES";
        reference?: string;
        metadata?: Record<string, unknown>;
        state?: PaymentState;
        recordedById?: string | null;
    }) => import(".prisma/client").Prisma.Prisma__PaymentClient<{
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        bookingId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        provider: string;
        state: import(".prisma/client").$Enums.PaymentState;
        reference: string | null;
        recordedById: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findMany: (params?: {
        skip?: number;
        take?: number;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
    }) => import(".prisma/client").Prisma.PrismaPromise<({
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
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        bookingId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        provider: string;
        state: import(".prisma/client").$Enums.PaymentState;
        reference: string | null;
        recordedById: string | null;
    })[]>;
    count: (params?: {
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
    }) => import(".prisma/client").Prisma.PrismaPromise<number>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__PaymentClient<({
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
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        bookingId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        provider: string;
        state: import(".prisma/client").$Enums.PaymentState;
        reference: string | null;
        recordedById: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByReference: (reference: string) => import(".prisma/client").Prisma.Prisma__PaymentClient<({
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
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        bookingId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        provider: string;
        state: import(".prisma/client").$Enums.PaymentState;
        reference: string | null;
        recordedById: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        state?: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
        reference?: string;
        metadata?: Record<string, unknown>;
    }) => import(".prisma/client").Prisma.Prisma__PaymentClient<{
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
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        bookingId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        provider: string;
        state: import(".prisma/client").$Enums.PaymentState;
        reference: string | null;
        recordedById: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__PaymentClient<{
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        bookingId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        provider: string;
        state: import(".prisma/client").$Enums.PaymentState;
        reference: string | null;
        recordedById: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=payment.repository.d.ts.map
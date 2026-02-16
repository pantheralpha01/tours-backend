export declare const refundRepository: {
    create: (data: {
        bookingId: string;
        paymentId: string;
        amount: number;
        currency: "USD" | "KES";
        reason: string;
        reference?: string;
    }) => import(".prisma/client").Prisma.Prisma__RefundClient<{
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
        payment: {
            id: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            bookingId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            provider: string;
            state: import(".prisma/client").$Enums.PaymentState;
            reference: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.RefundStatus;
        bookingId: string;
        reason: string;
        reference: string | null;
        paymentId: string;
        processedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findMany: (params?: {
        skip?: number;
        take?: number;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
        bookingId?: string;
        paymentId?: string;
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
        payment: {
            id: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            bookingId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            provider: string;
            state: import(".prisma/client").$Enums.PaymentState;
            reference: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.RefundStatus;
        bookingId: string;
        reason: string;
        reference: string | null;
        paymentId: string;
        processedAt: Date | null;
    })[]>;
    count: (params?: {
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        bookingId?: string;
        paymentId?: string;
    }) => import(".prisma/client").Prisma.PrismaPromise<number>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__RefundClient<({
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
        payment: {
            id: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            bookingId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            provider: string;
            state: import(".prisma/client").$Enums.PaymentState;
            reference: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.RefundStatus;
        bookingId: string;
        reason: string;
        reference: string | null;
        paymentId: string;
        processedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        status?: "REQUESTED" | "APPROVED" | "DECLINED" | "PROCESSING" | "COMPLETED" | "FAILED";
        reference?: string;
        processedAt?: Date;
    }) => import(".prisma/client").Prisma.Prisma__RefundClient<{
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
        payment: {
            id: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            bookingId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            provider: string;
            state: import(".prisma/client").$Enums.PaymentState;
            reference: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.RefundStatus;
        bookingId: string;
        reason: string;
        reference: string | null;
        paymentId: string;
        processedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__RefundClient<{
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.RefundStatus;
        bookingId: string;
        reason: string;
        reference: string | null;
        paymentId: string;
        processedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=refund.repository.d.ts.map
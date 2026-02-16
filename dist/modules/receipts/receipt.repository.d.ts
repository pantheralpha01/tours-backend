export declare const receiptRepository: {
    create: (data: {
        bookingId: string;
        paymentId: string;
        receiptNumber: string;
        amount: number;
        currency: "USD" | "KES";
        status?: "ISSUED" | "VOID";
        issuedAt?: Date;
        fileUrl?: string;
    }) => import(".prisma/client").Prisma.Prisma__ReceiptClient<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.ReceiptStatus;
        bookingId: string;
        fileUrl: string | null;
        paymentId: string;
        receiptNumber: string;
        issuedAt: Date;
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
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.ReceiptStatus;
        bookingId: string;
        fileUrl: string | null;
        paymentId: string;
        receiptNumber: string;
        issuedAt: Date;
    })[]>;
    count: (params?: {
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        bookingId?: string;
        paymentId?: string;
    }) => import(".prisma/client").Prisma.PrismaPromise<number>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__ReceiptClient<({
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
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.ReceiptStatus;
        bookingId: string;
        fileUrl: string | null;
        paymentId: string;
        receiptNumber: string;
        issuedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        status?: "ISSUED" | "VOID";
        fileUrl?: string;
    }) => import(".prisma/client").Prisma.Prisma__ReceiptClient<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.ReceiptStatus;
        bookingId: string;
        fileUrl: string | null;
        paymentId: string;
        receiptNumber: string;
        issuedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__ReceiptClient<{
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.ReceiptStatus;
        bookingId: string;
        fileUrl: string | null;
        paymentId: string;
        receiptNumber: string;
        issuedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=receipt.repository.d.ts.map
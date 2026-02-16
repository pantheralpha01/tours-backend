export declare const quoteRepository: {
    create: (data: {
        bookingId: string;
        agentId: string;
        title: string;
        amount: number;
        currency: "USD" | "KES";
        commissionRate: string;
        commissionAmount: string;
        commissionCurrency: "USD" | "KES";
        expiresAt?: Date;
        items?: Record<string, unknown>;
        notes?: string;
    }) => import(".prisma/client").Prisma.Prisma__QuoteClient<{
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
        agent: {
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
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
        commissionAmount: import("@prisma/client/runtime/library").Decimal;
        commissionCurrency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.QuoteStatus;
        agentId: string;
        bookingId: string;
        title: string;
        expiresAt: Date | null;
        items: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findMany: (params?: {
        skip?: number;
        take?: number;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
        bookingId?: string;
        agentId?: string;
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
        agent: {
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
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
        commissionAmount: import("@prisma/client/runtime/library").Decimal;
        commissionCurrency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.QuoteStatus;
        agentId: string;
        bookingId: string;
        title: string;
        expiresAt: Date | null;
        items: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    })[]>;
    count: (params?: {
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        bookingId?: string;
        agentId?: string;
    }) => import(".prisma/client").Prisma.PrismaPromise<number>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__QuoteClient<({
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
        agent: {
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
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
        commissionAmount: import("@prisma/client/runtime/library").Decimal;
        commissionCurrency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.QuoteStatus;
        agentId: string;
        bookingId: string;
        title: string;
        expiresAt: Date | null;
        items: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        title?: string;
        status?: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";
        amount?: number;
        currency?: "USD" | "KES";
        commissionRate?: string;
        commissionAmount?: string;
        commissionCurrency?: "USD" | "KES";
        expiresAt?: Date;
        items?: Record<string, unknown>;
        notes?: string;
    }) => import(".prisma/client").Prisma.Prisma__QuoteClient<{
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
        agent: {
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
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
        commissionAmount: import("@prisma/client/runtime/library").Decimal;
        commissionCurrency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.QuoteStatus;
        agentId: string;
        bookingId: string;
        title: string;
        expiresAt: Date | null;
        items: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__QuoteClient<{
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
        commissionAmount: import("@prisma/client/runtime/library").Decimal;
        commissionCurrency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.QuoteStatus;
        agentId: string;
        bookingId: string;
        title: string;
        expiresAt: Date | null;
        items: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=quote.repository.d.ts.map
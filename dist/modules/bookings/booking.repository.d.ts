export declare const bookingRepository: {
    create: (data: {
        customerName: string;
        serviceTitle: string;
        amount: number;
        currency?: "USD" | "KES";
        commissionRate: number | string;
        commissionAmount: number | string;
        commissionCurrency?: "USD" | "KES";
        status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
        paymentStatus?: "UNPAID" | "PAID";
        agentId: string;
        serviceStartAt?: Date;
        serviceEndAt?: Date;
        serviceTimezone?: string;
    }) => import(".prisma/client").Prisma.Prisma__BookingClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findMany: (params?: {
        skip?: number;
        take?: number;
        status?: string;
        agentId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        serviceStartFrom?: Date;
        serviceStartTo?: Date;
        sort?: string;
    }) => import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    count: (params?: {
        status?: string;
        agentId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        serviceStartFrom?: Date;
        serviceStartTo?: Date;
    }) => import(".prisma/client").Prisma.PrismaPromise<number>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__BookingClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        customerName?: string;
        serviceTitle?: string;
        amount?: number;
        currency?: "USD" | "KES";
        commissionRate?: number | string;
        commissionAmount?: number | string;
        commissionCurrency?: "USD" | "KES";
        status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
        paymentStatus?: "UNPAID" | "PAID";
        agentId?: string;
        serviceStartAt?: Date;
        serviceEndAt?: Date;
        serviceTimezone?: string;
    }) => import(".prisma/client").Prisma.Prisma__BookingClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__BookingClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=booking.repository.d.ts.map
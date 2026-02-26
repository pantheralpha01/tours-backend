import { PaginatedResponse } from "../../utils/pagination";
export declare const receiptService: {
    create: (data: {
        bookingId: string;
        paymentId: string;
        receiptNumber: string;
        amount: number;
        currency?: "USD" | "KES";
        status?: "ISSUED" | "VOID";
        issuedAt?: Date;
        fileUrl?: string;
    }) => import(".prisma/client").Prisma.Prisma__ReceiptClient<{
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
        payment: {
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
        };
    } & {
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.ReceiptStatus;
        bookingId: string;
        fileUrl: string | null;
        paymentId: string;
        receiptNumber: string;
        issuedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    list: (params?: {
        page?: number;
        limit?: number;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
        bookingId?: string;
        paymentId?: string;
    }) => Promise<PaginatedResponse<any>>;
    getById: (id: string) => import(".prisma/client").Prisma.Prisma__ReceiptClient<({
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
        payment: {
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
        };
    } & {
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.ReceiptStatus;
        bookingId: string;
        fileUrl: string | null;
        paymentId: string;
        receiptNumber: string;
        issuedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update: (id: string, data: {
        status?: "ISSUED" | "VOID";
        fileUrl?: string;
    }) => import(".prisma/client").Prisma.Prisma__ReceiptClient<{
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
        payment: {
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
        };
    } & {
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.ReceiptStatus;
        bookingId: string;
        fileUrl: string | null;
        paymentId: string;
        receiptNumber: string;
        issuedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove: (id: string) => import(".prisma/client").Prisma.Prisma__ReceiptClient<{
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.ReceiptStatus;
        bookingId: string;
        fileUrl: string | null;
        paymentId: string;
        receiptNumber: string;
        issuedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=receipt.service.d.ts.map
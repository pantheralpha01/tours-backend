import { PaymentState } from "@prisma/client";
import { PaginatedResponse } from "../../utils/pagination";
import { ExternalPaymentProvider } from "../../integrations/payment-gateway";
export declare const paymentService: {
    create: (data: {
        bookingId: string;
        provider: "MPESA" | "STRIPE" | "PAYPAL" | "VISA" | "MASTERCARD" | "CRYPTO";
        amount: number;
        currency?: "USD" | "KES";
        reference?: string;
        metadata?: Record<string, unknown>;
        actorId?: string;
        state?: PaymentState;
    }) => Promise<{
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
    }>;
    initiate: (data: {
        bookingId: string;
        provider: ExternalPaymentProvider;
        amount: number;
        currency?: "USD" | "KES";
        reference?: string;
        metadata?: Record<string, unknown>;
        actorId?: string;
    }) => Promise<{
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
        intent: {
            provider: "CRYPTO";
            amount: number;
            currency: "USD" | "KES";
            reference: string;
            status: string;
            walletAddress: string;
            instructions: {};
        } | {
            provider: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE";
            amount: number;
            currency: "USD" | "KES";
            reference: string;
            status: string;
            walletAddress?: undefined;
            instructions?: undefined;
        };
    }>;
    registerManual: (data: {
        bookingId: string;
        provider: string;
        amount: number;
        currency?: "USD" | "KES";
        reference?: string;
        metadata?: Record<string, unknown>;
        notes?: string;
        recordedAt?: Date;
        actorId?: string;
        state?: PaymentState;
    }) => Promise<{
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
    }>;
    processWebhookEvent: (data: {
        provider: ExternalPaymentProvider;
        reference: string;
        status: string;
        amount?: number;
        currency?: "USD" | "KES";
        eventType?: string;
        metadata?: Record<string, unknown>;
        rawPayload?: unknown;
        headers?: Record<string, unknown>;
        eventId?: string;
        reason?: string;
    }) => Promise<{
        handled: boolean;
        reason: string;
        paymentId?: undefined;
        targetState?: undefined;
        duplicate?: undefined;
    } | {
        handled: boolean;
        paymentId: string;
        targetState: import(".prisma/client").$Enums.PaymentState;
        duplicate: boolean;
        reason?: undefined;
    }>;
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
//# sourceMappingURL=payment.service.d.ts.map
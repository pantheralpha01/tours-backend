export declare const paymentHelpers: {
    getTotalSuccessfulPayments: (bookingId: string) => Promise<import("@prisma/client/runtime/library").Decimal | 0>;
    canAddPayment: (bookingId: string) => Promise<boolean>;
    syncPaymentStatus: (bookingId: string) => Promise<"UNPAID" | "PAID">;
};
//# sourceMappingURL=payment.helpers.d.ts.map
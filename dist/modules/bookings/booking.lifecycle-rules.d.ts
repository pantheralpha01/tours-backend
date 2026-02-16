import { BookingStatus, PaymentStatus } from "@prisma/client";
export declare const bookingLifecycleRules: {
    canConfirm: (booking: {
        status: BookingStatus;
        paymentStatus: PaymentStatus;
    }) => void;
    canCancel: (booking: {
        status: BookingStatus;
        paymentStatus: PaymentStatus;
    }) => void;
    canMarkComplete: (booking: {
        status: BookingStatus;
        paymentStatus: PaymentStatus;
    }) => void;
};
//# sourceMappingURL=booking.lifecycle-rules.d.ts.map
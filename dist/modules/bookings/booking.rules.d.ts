import { BookingStatus, PaymentStatus } from "@prisma/client";
type StatusContext = {
    status: BookingStatus;
    paymentStatus: PaymentStatus;
};
type StatusUpdate = Partial<StatusContext>;
export declare const validateStatusRules: (current: StatusContext, next: StatusUpdate) => void;
export {};
//# sourceMappingURL=booking.rules.d.ts.map
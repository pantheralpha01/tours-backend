import { BookingStatus } from "@prisma/client";
export declare const allowedTransitions: Record<BookingStatus, BookingStatus[]>;
export declare const assertValidTransition: (from: BookingStatus, to: BookingStatus) => void;
//# sourceMappingURL=booking.lifecycle.d.ts.map
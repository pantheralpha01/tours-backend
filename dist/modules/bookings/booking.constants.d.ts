import { Prisma } from "@prisma/client";
export declare const BOOKING_COMMISSION_RATE: Prisma.Decimal;
export declare const USD_TO_KES_RATE = 130;
export declare const calculateCommission: (amount: number | Prisma.Decimal) => Prisma.Decimal;
export declare const convertUsdToKes: (usd: number | Prisma.Decimal) => Prisma.Decimal;
export declare const convertKesToUsd: (kes: number | Prisma.Decimal) => Prisma.Decimal;
//# sourceMappingURL=booking.constants.d.ts.map
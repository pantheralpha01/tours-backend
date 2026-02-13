import { Prisma } from "@prisma/client";

// Commission: 25% service fee
export const BOOKING_COMMISSION_RATE = new Prisma.Decimal("0.25");

// Exchange rate: 1 USD = 130 KES
export const USD_TO_KES_RATE = 130;

export const calculateCommission = (amount: number | Prisma.Decimal) => {
  const decimal = typeof amount === "number" ? new Prisma.Decimal(amount) : amount;
  return decimal.mul(BOOKING_COMMISSION_RATE);
};

export const convertUsdToKes = (usd: number | Prisma.Decimal) => {
  const decimal = typeof usd === "number" ? new Prisma.Decimal(usd) : usd;
  return decimal.mul(USD_TO_KES_RATE);
};

export const convertKesToUsd = (kes: number | Prisma.Decimal) => {
  const decimal = typeof kes === "number" ? new Prisma.Decimal(kes) : kes;
  return decimal.div(USD_TO_KES_RATE);
};

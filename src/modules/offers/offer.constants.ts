export const OFFER_BASE_FEE_RATE = 0.25;

export const OFFER_DISCOUNT_TIERS: Array<{ threshold: number; rate: number }> = [
  { threshold: 5000, rate: 0.02 },
  { threshold: 10000, rate: 0.04 },
  { threshold: 20000, rate: 0.06 },
];

export const OFFER_DEFAULT_CURRENCY: "USD" | "KES" = "USD";

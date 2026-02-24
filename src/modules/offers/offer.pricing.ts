import { OFFER_BASE_FEE_RATE, OFFER_DISCOUNT_TIERS, OFFER_DEFAULT_CURRENCY } from "./offer.constants";

export type OfferAddonInput = {
  label: string;
  amount: number;
};

export type OfferPricingInput = {
  baseAmount: number;
  addons?: OfferAddonInput[];
  currency?: "USD" | "KES";
  discountRateOverride?: number;
};

export type OfferPricingBreakdown = {
  currency: "USD" | "KES";
  baseAmount: number;
  addons: OfferAddonInput[];
  addonsTotal: number;
  subtotal: number;
  fee: {
    rate: number;
    amount: number;
  };
  discount: {
    rate: number;
    amount: number;
  };
  total: number;
};

export type OfferPricingResult = OfferPricingBreakdown & {
  feePercentage: number;
  discountRate: number;
};

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const resolveDiscountRate = (subtotal: number) => {
  let rate = 0;
  for (const tier of OFFER_DISCOUNT_TIERS) {
    if (subtotal >= tier.threshold) {
      rate = tier.rate;
    }
  }
  return rate;
};

export const calculateOfferPrice = (input: OfferPricingInput): OfferPricingResult => {
  const currency = input.currency ?? OFFER_DEFAULT_CURRENCY;
  const addons = (input.addons ?? []).filter((addon) => addon.amount > 0);
  const addonsTotal = roundCurrency(
    addons.reduce((sum, addon) => sum + addon.amount, 0)
  );

  const baseAmount = roundCurrency(input.baseAmount);
  const subtotal = roundCurrency(baseAmount + addonsTotal);
  const feePercentage = OFFER_BASE_FEE_RATE;
  const feeAmount = roundCurrency(subtotal * feePercentage);
  const discountRate = input.discountRateOverride ?? resolveDiscountRate(subtotal);
  const discountAmount = roundCurrency(subtotal * discountRate);
  const total = roundCurrency(subtotal + feeAmount - discountAmount);

  return {
    currency,
    baseAmount,
    addons,
    addonsTotal,
    subtotal,
    fee: {
      rate: feePercentage,
      amount: feeAmount,
    },
    discount: {
      rate: discountRate,
      amount: discountAmount,
    },
    total,
    feePercentage,
    discountRate,
  };
};

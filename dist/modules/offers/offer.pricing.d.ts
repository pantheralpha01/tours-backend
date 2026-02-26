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
export declare const calculateOfferPrice: (input: OfferPricingInput) => OfferPricingResult;
//# sourceMappingURL=offer.pricing.d.ts.map
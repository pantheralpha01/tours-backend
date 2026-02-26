"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOfferPrice = void 0;
const offer_constants_1 = require("./offer.constants");
const roundCurrency = (value) => Math.round(value * 100) / 100;
const resolveDiscountRate = (subtotal) => {
    let rate = 0;
    for (const tier of offer_constants_1.OFFER_DISCOUNT_TIERS) {
        if (subtotal >= tier.threshold) {
            rate = tier.rate;
        }
    }
    return rate;
};
const calculateOfferPrice = (input) => {
    const currency = input.currency ?? offer_constants_1.OFFER_DEFAULT_CURRENCY;
    const addons = (input.addons ?? []).filter((addon) => addon.amount > 0);
    const addonsTotal = roundCurrency(addons.reduce((sum, addon) => sum + addon.amount, 0));
    const baseAmount = roundCurrency(input.baseAmount);
    const subtotal = roundCurrency(baseAmount + addonsTotal);
    const feePercentage = offer_constants_1.OFFER_BASE_FEE_RATE;
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
exports.calculateOfferPrice = calculateOfferPrice;
//# sourceMappingURL=offer.pricing.js.map
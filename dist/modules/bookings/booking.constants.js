"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertKesToUsd = exports.convertUsdToKes = exports.calculateCommission = exports.USD_TO_KES_RATE = exports.BOOKING_COMMISSION_RATE = void 0;
const client_1 = require("@prisma/client");
// Commission: 25% service fee
exports.BOOKING_COMMISSION_RATE = new client_1.Prisma.Decimal("0.25");
// Exchange rate: 1 USD = 130 KES
exports.USD_TO_KES_RATE = 130;
const calculateCommission = (amount) => {
    const decimal = typeof amount === "number" ? new client_1.Prisma.Decimal(amount) : amount;
    return decimal.mul(exports.BOOKING_COMMISSION_RATE);
};
exports.calculateCommission = calculateCommission;
const convertUsdToKes = (usd) => {
    const decimal = typeof usd === "number" ? new client_1.Prisma.Decimal(usd) : usd;
    return decimal.mul(exports.USD_TO_KES_RATE);
};
exports.convertUsdToKes = convertUsdToKes;
const convertKesToUsd = (kes) => {
    const decimal = typeof kes === "number" ? new client_1.Prisma.Decimal(kes) : kes;
    return decimal.div(exports.USD_TO_KES_RATE);
};
exports.convertKesToUsd = convertKesToUsd;
//# sourceMappingURL=booking.constants.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twilioService = void 0;
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const isWhatsappConfigured = () => Boolean(config_1.config.twilioAccountSid && config_1.config.twilioAuthToken && config_1.config.twilioWhatsappNumber);
const isSmsConfigured = () => Boolean(config_1.config.twilioAccountSid && config_1.config.twilioAuthToken && config_1.config.twilioSmsNumber);
exports.twilioService = {
    sendWhatsappMessage: async (to, message) => {
        if (!isWhatsappConfigured()) {
            throw ApiError_1.ApiError.badRequest("Twilio WhatsApp is not configured", "TWILIO_NOT_CONFIGURED");
        }
        return {
            to,
            message,
            from: config_1.config.twilioWhatsappNumber,
            status: "queued",
        };
    },
    sendSmsMessage: async (to, message) => {
        if (!isSmsConfigured()) {
            throw ApiError_1.ApiError.badRequest("Twilio SMS is not configured", "TWILIO_NOT_CONFIGURED");
        }
        return {
            to,
            message,
            from: config_1.config.twilioSmsNumber,
            status: "queued",
        };
    },
};
//# sourceMappingURL=twilio.js.map
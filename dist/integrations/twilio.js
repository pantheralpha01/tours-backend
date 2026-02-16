"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twilioService = void 0;
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const isConfigured = () => Boolean(config_1.config.twilioAccountSid && config_1.config.twilioAuthToken && config_1.config.twilioWhatsappNumber);
exports.twilioService = {
    sendWhatsappMessage: async (to, message) => {
        if (!isConfigured()) {
            throw ApiError_1.ApiError.badRequest("Twilio WhatsApp is not configured", "TWILIO_NOT_CONFIGURED");
        }
        return {
            to,
            message,
            from: config_1.config.twilioWhatsappNumber,
            status: "queued",
        };
    },
};
//# sourceMappingURL=twilio.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const isConfigured = () => Boolean(config_1.config.notificationEmailFrom);
exports.emailService = {
    sendEmail: async ({ to, subject, text, html }) => {
        if (!isConfigured()) {
            throw ApiError_1.ApiError.badRequest("Notification email sender is not configured", "EMAIL_NOT_CONFIGURED");
        }
        return {
            to,
            from: config_1.config.notificationEmailFrom,
            subject,
            text,
            html,
            status: "queued",
        };
    },
};
//# sourceMappingURL=email.js.map
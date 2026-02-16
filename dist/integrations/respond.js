"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondService = void 0;
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const isConfigured = () => Boolean(config_1.config.respondApiKey && config_1.config.respondApiBaseUrl);
exports.respondService = {
    handleWebhook: async (payload) => {
        if (!isConfigured()) {
            throw ApiError_1.ApiError.badRequest("Respond.io is not configured", "RESPOND_NOT_CONFIGURED");
        }
        return {
            status: "received",
            payload,
        };
    },
};
//# sourceMappingURL=respond.js.map
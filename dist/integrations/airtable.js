"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.airtableService = void 0;
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const isConfigured = () => Boolean(config_1.config.airtableApiKey && config_1.config.airtableBaseId);
exports.airtableService = {
    syncProviders: async (action, table) => {
        if (!isConfigured()) {
            throw ApiError_1.ApiError.badRequest("Airtable is not configured", "AIRTABLE_NOT_CONFIGURED");
        }
        return {
            action,
            table: table ?? config_1.config.airtableTable ?? "",
            status: "queued",
        };
    },
};
//# sourceMappingURL=airtable.js.map
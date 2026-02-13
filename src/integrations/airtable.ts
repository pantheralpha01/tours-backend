import { config } from "../config";
import { ApiError } from "../utils/ApiError";

const isConfigured = () => Boolean(config.airtableApiKey && config.airtableBaseId);

export const airtableService = {
  syncProviders: async (action: "pull" | "push", table?: string) => {
    if (!isConfigured()) {
      throw ApiError.badRequest("Airtable is not configured", "AIRTABLE_NOT_CONFIGURED");
    }

    return {
      action,
      table: table ?? config.airtableTable ?? "",
      status: "queued",
    };
  },
};

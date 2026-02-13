import { config } from "../config";
import { ApiError } from "../utils/ApiError";

const isConfigured = () => Boolean(config.respondApiKey && config.respondApiBaseUrl);

export const respondService = {
  handleWebhook: async (payload: Record<string, unknown>) => {
    if (!isConfigured()) {
      throw ApiError.badRequest("Respond.io is not configured", "RESPOND_NOT_CONFIGURED");
    }

    return {
      status: "received",
      payload,
    };
  },
};

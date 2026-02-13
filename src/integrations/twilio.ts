import { config } from "../config";
import { ApiError } from "../utils/ApiError";

const isConfigured = () =>
  Boolean(config.twilioAccountSid && config.twilioAuthToken && config.twilioWhatsappNumber);

export const twilioService = {
  sendWhatsappMessage: async (to: string, message: string) => {
    if (!isConfigured()) {
      throw ApiError.badRequest("Twilio WhatsApp is not configured", "TWILIO_NOT_CONFIGURED");
    }

    return {
      to,
      message,
      from: config.twilioWhatsappNumber,
      status: "queued",
    };
  },
};

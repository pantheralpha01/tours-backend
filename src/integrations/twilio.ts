import { config } from "../config";
import { ApiError } from "../utils/ApiError";

const isWhatsappConfigured = () =>
  Boolean(config.twilioAccountSid && config.twilioAuthToken && config.twilioWhatsappNumber);

const isSmsConfigured = () =>
  Boolean(config.twilioAccountSid && config.twilioAuthToken && config.twilioSmsNumber);

export const twilioService = {
  sendWhatsappMessage: async (to: string, message: string) => {
    if (!isWhatsappConfigured()) {
      throw ApiError.badRequest("Twilio WhatsApp is not configured", "TWILIO_NOT_CONFIGURED");
    }

    return {
      to,
      message,
      from: config.twilioWhatsappNumber,
      status: "queued",
    };
  },

  sendSmsMessage: async (to: string, message: string) => {
    if (!isSmsConfigured()) {
      throw ApiError.badRequest("Twilio SMS is not configured", "TWILIO_NOT_CONFIGURED");
    }

    return {
      to,
      message,
      from: config.twilioSmsNumber,
      status: "queued",
    };
  },
};

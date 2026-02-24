import { config } from "../config";
import { ApiError } from "../utils/ApiError";

type SendEmailInput = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

const isConfigured = () => Boolean(config.notificationEmailFrom);

export const emailService = {
  sendEmail: async ({ to, subject, text, html }: SendEmailInput) => {
    if (!isConfigured()) {
      throw ApiError.badRequest(
        "Notification email sender is not configured",
        "EMAIL_NOT_CONFIGURED"
      );
    }

    return {
      to,
      from: config.notificationEmailFrom,
      subject,
      text,
      html,
      status: "queued",
    };
  },
};

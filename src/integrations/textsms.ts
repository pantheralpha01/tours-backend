/**
 * TextSMS Integration Service
 * Sends SMS messages via TextSMS API for phone verification and password reset
 * API: https://sms.textsms.co.ke/api/services/sendsms
 */

import axios from "axios";
import { config } from "../config";
import { ApiError } from "../utils/ApiError";

interface TextSmsPayload {
  apikey: string;
  partnerID: string;
  shortcode: string;
  mobile: string;
  message: string;
}

interface TextSmsResponse {
  status: string;
  message: string;
  transactionId?: string;
  code?: number | string;
  id?: string;
  messageId?: string;
}

const isTextSmsConfigured = (): boolean => {
  return Boolean(
    config.textsms.apiUrl &&
      config.textsms.apiKey &&
      config.textsms.partnerId &&
      config.textsms.shortcode
  );
};

/**
 * Validate phone number format (Kenya)
 * Accepts: +254712345678, 0712345678, 254712345678
 */
export const normalizePhoneNumber = (phone: string): string => {
  let normalized = phone.replace(/\s+/g, "");

  // Remove '+' prefix
  if (normalized.startsWith("+")) {
    normalized = normalized.substring(1);
  }

  // Convert 0712... to 254712...
  if (normalized.startsWith("0")) {
    normalized = "254" + normalized.substring(1);
  }

  // Ensure it starts with 254
  if (!normalized.startsWith("254")) {
    normalized = "254" + normalized;
  }

  // Validate length (should be 254 + 9 digits = 12 chars)
  if (normalized.length !== 12 || !normalized.match(/^254\d{9}$/)) {
    throw ApiError.badRequest(
      "Invalid phone number format. Use +254712345678 or 0712345678"
    );
  }

  return normalized;
};

export const textsmsService = {
  /**
   * Send SMS verification code to user's phone
   * Used for phone verification during registration
   */
  sendVerificationCode: async (
    phoneNumber: string,
    verificationCode: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    if (!isTextSmsConfigured()) {
      throw ApiError.badRequest(
        "TextSMS service is not configured",
        "TEXTSMS_NOT_CONFIGURED"
      );
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const message = `Your verification code is: ${verificationCode}. It expires in 10 minutes. Do not share this code with anyone.`;

    try {
      const payload: TextSmsPayload = {
        apikey: config.textsms.apiKey,
        partnerID: config.textsms.partnerId, // Send as string as per API spec
        shortcode: config.textsms.shortcode,
        mobile: normalizedPhone,
        message,
      };

      console.log("[TextSMS] Sending verification code to:", normalizedPhone);
      console.log("[TextSMS] Payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post<TextSmsResponse>(
        config.textsms.apiUrl,
        payload,
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[TextSMS] Response Status:", response.status);
      console.log("[TextSMS] Response Data:", JSON.stringify(response.data, null, 2));
      console.log("[TextSMS] Response Status Field:", response.data.status);
      console.log("[TextSMS] Response Object Keys:", Object.keys(response.data));

      // Check multiple possible success indicators
      const isSuccess = 
        response.data.status === "success" || 
        response.data.status === "Success" ||
        response.data.code === 0 ||
        response.data.code === "0" ||
        response.status === 200;

      if (isSuccess) {
        console.log("[TextSMS] ✓ SMS sent successfully");
        return {
          success: true,
          messageId: response.data.transactionId || response.data.id || response.data.messageId,
        };
      }

      console.log("[TextSMS] ✗ Response status was:", response.data.status);
      return {
        success: false,
        error: response.data.message || "Failed to send SMS",
      };
    } catch (error) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message || error.message
          : "Failed to send SMS";

      console.error("[TextSMS] Catch Error Block");
      console.error("[TextSMS] Error Type:", error instanceof axios.AxiosError ? "AxiosError" : typeof error);
      
      if (error instanceof axios.AxiosError) {
        console.error("[TextSMS] Status:", error.response?.status);
        console.error("[TextSMS] Full Response:", JSON.stringify(error.response?.data, null, 2));
        console.error("[TextSMS] Error Message:", error.message);
      } else if (error instanceof Error) {
        console.error("[TextSMS] Error Message:", error.message);
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Send password reset link via SMS
   * Used when user requests password reset
   */
  sendPasswordResetCode: async (
    phoneNumber: string,
    resetCode: string,
    resetLink?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    if (!isTextSmsConfigured()) {
      throw ApiError.badRequest(
        "TextSMS service is not configured",
        "TEXTSMS_NOT_CONFIGURED"
      );
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const message = resetLink
      ? `Reset your password: ${resetLink}. Code: ${resetCode}. Valid for 30 minutes.`
      : `Your password reset code is: ${resetCode}. It expires in 30 minutes. Do not share this code.`;

    try {
      const payload: TextSmsPayload = {
        apikey: config.textsms.apiKey,
        partnerID: config.textsms.partnerId, // Send as string as per API spec
        shortcode: config.textsms.shortcode,
        mobile: normalizedPhone,
        message,
      };

      const response = await axios.post<TextSmsResponse>(
        config.textsms.apiUrl,
        payload,
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        return {
          success: true,
          messageId: response.data.transactionId,
        };
      }

      return {
        success: false,
        error: response.data.message || "Failed to send SMS",
      };
    } catch (error) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message || error.message
          : "Failed to send SMS";

      console.error("[TextSMS Error]", errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Send OTP for two-factor authentication
   * Used for additional security on sensitive operations
   */
  sendOtp: async (
    phoneNumber: string,
    otp: string,
    purpose: string = "verification"
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    if (!isTextSmsConfigured()) {
      throw ApiError.badRequest(
        "TextSMS service is not configured",
        "TEXTSMS_NOT_CONFIGURED"
      );
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const message = `Your ${purpose} OTP is: ${otp}. It expires in 5 minutes. Never share your OTP.`;

    try {
      const payload: TextSmsPayload = {
        apikey: config.textsms.apiKey,
        partnerID: config.textsms.partnerId, // Send as string as per API spec
        shortcode: config.textsms.shortcode,
        mobile: normalizedPhone,
        message,
      };

      const response = await axios.post<TextSmsResponse>(
        config.textsms.apiUrl,
        payload,
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        return {
          success: true,
          messageId: response.data.transactionId,
        };
      }

      return {
        success: false,
        error: response.data.message || "Failed to send SMS",
      };
    } catch (error) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message || error.message
          : "Failed to send SMS";

      console.error("[TextSMS Error]", errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
};

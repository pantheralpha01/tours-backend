/**
 * TextSMS Integration Service
 * Sends SMS messages via TextSMS API for phone verification and password reset
 * API: https://sms.textsms.co.ke/api/services/sendsms
 */
/**
 * Validate phone number format (Kenya)
 * Accepts: +254712345678, 0712345678, 254712345678
 */
export declare const normalizePhoneNumber: (phone: string) => string;
export declare const textsmsService: {
    /**
     * Send SMS verification code to user's phone
     * Used for phone verification during registration
     */
    sendVerificationCode: (phoneNumber: string, verificationCode: string) => Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    /**
     * Send password reset link via SMS
     * Used when user requests password reset
     */
    sendPasswordResetCode: (phoneNumber: string, resetCode: string, resetLink?: string) => Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    /**
     * Send OTP for two-factor authentication
     * Used for additional security on sensitive operations
     */
    sendOtp: (phoneNumber: string, otp: string, purpose?: string) => Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
};
//# sourceMappingURL=textsms.d.ts.map
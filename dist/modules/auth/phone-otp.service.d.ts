export type PhoneOtpVerificationResult = {
    valid: boolean;
    reason?: "NOT_FOUND" | "EXPIRED" | "TOO_MANY_ATTEMPTS" | "MISMATCH";
    attemptsRemaining?: number;
};
export declare const phoneOtpService: {
    send(phone: string, purpose?: string): Promise<{
        normalizedPhone: string;
        expiresAt: Date;
    }>;
    verify(phone: string, otp: string): Promise<PhoneOtpVerificationResult>;
    clear(phone: string): Promise<void>;
};
//# sourceMappingURL=phone-otp.service.d.ts.map
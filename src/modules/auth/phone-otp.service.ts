import crypto from "crypto";
import { normalizePhoneNumber, textsmsService } from "../../integrations/textsms";
import { prisma } from "../../config/prisma";

const OTP_TTL_MS = 45 * 60 * 1000; // 45 minutes
const OTP_CODE_LENGTH = 6;
const OTP_MAX_ATTEMPTS = 3;

const generateOtp = (): string =>
  crypto.randomInt(0, 10 ** OTP_CODE_LENGTH).toString().padStart(OTP_CODE_LENGTH, "0");

const hashOtp = (otp: string): string =>
  crypto.createHash("sha256").update(otp).digest("hex");

export type PhoneOtpVerificationResult = {
  valid: boolean;
  reason?: "NOT_FOUND" | "EXPIRED" | "TOO_MANY_ATTEMPTS" | "MISMATCH";
  attemptsRemaining?: number;
};

export const phoneOtpService = {
  async send(phone: string, purpose = "verification") {
    const normalizedPhone = normalizePhoneNumber(phone);
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    // Upsert — overwrite any existing OTP for this phone
    await prisma.phoneOtp.upsert({
      where: { phone: normalizedPhone },
      create: {
        phone: normalizedPhone,
        otpHash: hashOtp(otp),
        expiresAt,
        attempts: 0,
      },
      update: {
        otpHash: hashOtp(otp),
        expiresAt,
        attempts: 0,
      },
    });

    // Fire-and-forget — OTP is persisted regardless of delivery outcome.
    textsmsService.sendOtp(normalizedPhone, otp, purpose).then((response) => {
      if (!response.success) {
        console.warn(`[PhoneOTP] SMS delivery issue for ${normalizedPhone}: ${response.error}`);
      }
    }).catch((err) => {
      console.warn("[PhoneOTP] SMS send error (non-fatal):", err?.message ?? err);
    });

    return { normalizedPhone, expiresAt };
  },

  async verify(phone: string, otp: string): Promise<PhoneOtpVerificationResult> {
    const normalizedPhone = normalizePhoneNumber(phone);
    const record = await prisma.phoneOtp.findUnique({ where: { phone: normalizedPhone } });

    if (!record) {
      return { valid: false, reason: "NOT_FOUND" };
    }

    if (record.expiresAt.getTime() < Date.now()) {
      await prisma.phoneOtp.delete({ where: { phone: normalizedPhone } });
      return { valid: false, reason: "EXPIRED" };
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.phoneOtp.delete({ where: { phone: normalizedPhone } });
      return { valid: false, reason: "TOO_MANY_ATTEMPTS" };
    }

    const hashed = hashOtp(otp);
    if (hashed !== record.otpHash) {
      const newAttempts = record.attempts + 1;
      const attemptsRemaining = Math.max(0, OTP_MAX_ATTEMPTS - newAttempts);
      if (newAttempts >= OTP_MAX_ATTEMPTS) {
        await prisma.phoneOtp.delete({ where: { phone: normalizedPhone } });
      } else {
        await prisma.phoneOtp.update({
          where: { phone: normalizedPhone },
          data: { attempts: newAttempts },
        });
      }
      return { valid: false, reason: "MISMATCH", attemptsRemaining };
    }

    // Valid — consume it
    await prisma.phoneOtp.delete({ where: { phone: normalizedPhone } });
    return { valid: true };
  },

  async clear(phone: string) {
    const normalizedPhone = normalizePhoneNumber(phone);
    await prisma.phoneOtp.deleteMany({ where: { phone: normalizedPhone } });
  },
};


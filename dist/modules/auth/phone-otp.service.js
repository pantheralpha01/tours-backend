"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneOtpService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const textsms_1 = require("../../integrations/textsms");
const prisma_1 = require("../../config/prisma");
const OTP_TTL_MS = 45 * 60 * 1000; // 45 minutes
const OTP_CODE_LENGTH = 6;
const OTP_MAX_ATTEMPTS = 3;
const generateOtp = () => crypto_1.default.randomInt(0, 10 ** OTP_CODE_LENGTH).toString().padStart(OTP_CODE_LENGTH, "0");
const hashOtp = (otp) => crypto_1.default.createHash("sha256").update(otp).digest("hex");
exports.phoneOtpService = {
    async send(phone, purpose = "verification") {
        const normalizedPhone = (0, textsms_1.normalizePhoneNumber)(phone);
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + OTP_TTL_MS);
        // Upsert — overwrite any existing OTP for this phone
        await prisma_1.prisma.phoneOtp.upsert({
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
        textsms_1.textsmsService.sendOtp(normalizedPhone, otp, purpose).then((response) => {
            if (!response.success) {
                console.warn(`[PhoneOTP] SMS delivery issue for ${normalizedPhone}: ${response.error}`);
            }
        }).catch((err) => {
            console.warn("[PhoneOTP] SMS send error (non-fatal):", err?.message ?? err);
        });
        return { normalizedPhone, expiresAt };
    },
    async verify(phone, otp) {
        const normalizedPhone = (0, textsms_1.normalizePhoneNumber)(phone);
        const record = await prisma_1.prisma.phoneOtp.findUnique({ where: { phone: normalizedPhone } });
        if (!record) {
            return { valid: false, reason: "NOT_FOUND" };
        }
        if (record.expiresAt.getTime() < Date.now()) {
            await prisma_1.prisma.phoneOtp.delete({ where: { phone: normalizedPhone } });
            return { valid: false, reason: "EXPIRED" };
        }
        if (record.attempts >= OTP_MAX_ATTEMPTS) {
            await prisma_1.prisma.phoneOtp.delete({ where: { phone: normalizedPhone } });
            return { valid: false, reason: "TOO_MANY_ATTEMPTS" };
        }
        const hashed = hashOtp(otp);
        if (hashed !== record.otpHash) {
            const newAttempts = record.attempts + 1;
            const attemptsRemaining = Math.max(0, OTP_MAX_ATTEMPTS - newAttempts);
            if (newAttempts >= OTP_MAX_ATTEMPTS) {
                await prisma_1.prisma.phoneOtp.delete({ where: { phone: normalizedPhone } });
            }
            else {
                await prisma_1.prisma.phoneOtp.update({
                    where: { phone: normalizedPhone },
                    data: { attempts: newAttempts },
                });
            }
            return { valid: false, reason: "MISMATCH", attemptsRemaining };
        }
        // Valid — consume it
        await prisma_1.prisma.phoneOtp.delete({ where: { phone: normalizedPhone } });
        return { valid: true };
    },
    async clear(phone) {
        const normalizedPhone = (0, textsms_1.normalizePhoneNumber)(phone);
        await prisma_1.prisma.phoneOtp.deleteMany({ where: { phone: normalizedPhone } });
    },
};
//# sourceMappingURL=phone-otp.service.js.map
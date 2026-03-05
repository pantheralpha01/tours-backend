"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const user_repository_1 = require("../users/user.repository");
const refresh_token_repository_1 = require("./refresh-token.repository");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const ApiError_1 = require("../../utils/ApiError");
const phone_otp_service_1 = require("./phone-otp.service");
const textsms_1 = require("../../integrations/textsms");
const generateTokens = (userId, role) => {
    const accessToken = (0, jwt_1.signAccessToken)({ sub: userId, role });
    const refreshToken = (0, jwt_1.signRefreshToken)({ sub: userId });
    return { accessToken, refreshToken };
};
const calculateRefreshTokenExpiry = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
};
const formatUserPayload = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone ?? undefined,
    isActive: user.isActive,
    createdAt: user.createdAt,
});
const maskPhoneNumber = (phone) => {
    if (phone.length <= 4) {
        return phone;
    }
    const visible = phone.slice(-2);
    return `${"*".repeat(Math.max(0, phone.length - 2))}${visible}`;
};
exports.authService = {
    register: async (data) => {
        const existing = await user_repository_1.userRepository.findByEmail(data.email);
        if (existing) {
            throw ApiError_1.ApiError.badRequest("Email already in use");
        }
        const hashed = await (0, password_1.hashPassword)(data.password);
        const user = await user_repository_1.userRepository.create({
            ...data,
            password: hashed,
        });
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        await refresh_token_repository_1.refreshTokenRepository.create({
            token: refreshToken,
            userId: user.id,
            expiresAt: calculateRefreshTokenExpiry(),
        });
        return {
            user: formatUserPayload(user),
            accessToken,
            refreshToken,
        };
    },
    login: async (data) => {
        const user = await user_repository_1.userRepository.findByEmail(data.email);
        if (!user || !user.isActive) {
            throw ApiError_1.ApiError.unauthorized("Invalid credentials");
        }
        const ok = await (0, password_1.comparePassword)(data.password, user.password);
        if (!ok) {
            throw ApiError_1.ApiError.unauthorized("Invalid credentials");
        }
        if (!user.phone) {
            throw ApiError_1.ApiError.badRequest("Phone number required for OTP verification");
        }
        const { normalizedPhone, expiresAt } = await phone_otp_service_1.phoneOtpService.send(user.phone, "login");
        return {
            message: "OTP sent to your phone",
            otpRequired: true,
            phone: normalizedPhone, // pass this to /verify-otp
            otpExpiresAt: expiresAt,
            maskedPhone: maskPhoneNumber(normalizedPhone),
        };
    },
    verifyLoginOtp: async (data) => {
        const verification = await phone_otp_service_1.phoneOtpService.verify(data.phone, data.otp);
        // Verify OTP first — avoids leaking user existence on bad OTP
        if (!verification.valid) {
            switch (verification.reason) {
                case "NOT_FOUND":
                    throw ApiError_1.ApiError.badRequest("No verification code found. Request a new OTP.");
                case "EXPIRED":
                    throw ApiError_1.ApiError.badRequest("Verification code expired. Request a new OTP.");
                case "TOO_MANY_ATTEMPTS":
                    throw ApiError_1.ApiError.badRequest("Too many failed attempts. Request a new OTP.");
                case "MISMATCH":
                default:
                    throw ApiError_1.ApiError.badRequest("Invalid verification code.");
            }
        }
        // OTP valid — now load user by phone
        const normalizedPhone = (0, textsms_1.normalizePhoneNumber)(data.phone);
        const user = await user_repository_1.userRepository.findByPhone(normalizedPhone);
        if (!user || !user.isActive) {
            throw ApiError_1.ApiError.unauthorized("Invalid credentials");
        }
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        await refresh_token_repository_1.refreshTokenRepository.create({
            token: refreshToken,
            userId: user.id,
            expiresAt: calculateRefreshTokenExpiry(),
        });
        return {
            user: formatUserPayload(user),
            accessToken,
            refreshToken,
        };
    },
    refresh: async (token) => {
        try {
            (0, jwt_1.verifyRefreshToken)(token);
        }
        catch {
            throw ApiError_1.ApiError.unauthorized("Invalid refresh token");
        }
        const storedToken = await refresh_token_repository_1.refreshTokenRepository.findByToken(token);
        if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
            throw ApiError_1.ApiError.unauthorized("Refresh token expired or revoked");
        }
        if (!storedToken.user.isActive) {
            throw ApiError_1.ApiError.unauthorized("User account is inactive");
        }
        // Revoke old refresh token
        await refresh_token_repository_1.refreshTokenRepository.revoke(token);
        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(storedToken.user.id, storedToken.user.role);
        // Store new refresh token
        await refresh_token_repository_1.refreshTokenRepository.create({
            token: newRefreshToken,
            userId: storedToken.user.id,
            expiresAt: calculateRefreshTokenExpiry(),
        });
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    },
    logout: async (token) => {
        try {
            await refresh_token_repository_1.refreshTokenRepository.revoke(token);
        }
        catch {
            // Token might not exist, that's fine
        }
    },
    forgotPassword: async (data) => {
        const user = await user_repository_1.userRepository.findByPhone(data.phone);
        // Always respond generically to avoid phone enumeration
        if (!user || !user.isActive) {
            return { message: "If that phone is registered, an OTP has been sent." };
        }
        const { normalizedPhone, expiresAt } = await phone_otp_service_1.phoneOtpService.send(user.phone, "password reset");
        return {
            message: "OTP sent to your phone",
            phone: normalizedPhone,
            maskedPhone: maskPhoneNumber(normalizedPhone),
            otpExpiresAt: expiresAt,
        };
    },
    resetPassword: async (data) => {
        const verification = await phone_otp_service_1.phoneOtpService.verify(data.phone, data.otp);
        if (!verification.valid) {
            switch (verification.reason) {
                case "NOT_FOUND":
                    throw ApiError_1.ApiError.badRequest("No OTP found. Request a new one.");
                case "EXPIRED":
                    throw ApiError_1.ApiError.badRequest("OTP expired. Request a new one.");
                case "TOO_MANY_ATTEMPTS":
                    throw ApiError_1.ApiError.badRequest("Too many failed attempts. Request a new OTP.");
                case "MISMATCH":
                default:
                    throw ApiError_1.ApiError.badRequest("Invalid OTP.");
            }
        }
        const normalizedPhone = (0, textsms_1.normalizePhoneNumber)(data.phone);
        const user = await user_repository_1.userRepository.findByPhone(normalizedPhone);
        if (!user || !user.isActive) {
            throw ApiError_1.ApiError.unauthorized("Invalid request.");
        }
        const hashed = await (0, password_1.hashPassword)(data.newPassword);
        await user_repository_1.userRepository.updatePassword(user.id, hashed);
        return { message: "Password reset successfully. You can now log in." };
    },
};
//# sourceMappingURL=auth.service.js.map
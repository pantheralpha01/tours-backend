import { userRepository } from "../users/user.repository";
import { refreshTokenRepository } from "./refresh-token.repository";
import { hashPassword, comparePassword } from "../../utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { ApiError } from "../../utils/ApiError";
import { phoneOtpService } from "./phone-otp.service";
import { normalizePhoneNumber } from "../../integrations/textsms";

const generateTokens = (userId: string, role: "ADMIN" | "AGENT" | "MANAGER" | "PARTNER") => {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId });
  return { accessToken, refreshToken };
};

const calculateRefreshTokenExpiry = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
};

const formatUserPayload = (user: {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "AGENT" | "MANAGER" | "PARTNER";
  phone?: string | null;
  isActive: boolean;
  createdAt: Date;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone ?? undefined,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

const maskPhoneNumber = (phone: string) => {
  if (phone.length <= 4) {
    return phone;
  }
  const visible = phone.slice(-2);
  return `${"*".repeat(Math.max(0, phone.length - 2))}${visible}`;
};

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    idNumber?: string;
    idType?: string;
    profilePicUrl?: string;
    role?: "ADMIN" | "AGENT" | "MANAGER" | "PARTNER";
  }) => {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw ApiError.badRequest("Email already in use");
    }

    const hashed = await hashPassword(data.password);
    const user = await userRepository.create({
      ...data,
      password: hashed,
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    await refreshTokenRepository.create({
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

  login: async (data: { email: string; password: string }) => {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const ok = await comparePassword(data.password, user.password);
    if (!ok) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    if (!user.phone) {
      throw ApiError.badRequest("Phone number required for OTP verification");
    }

    const { normalizedPhone, expiresAt } = await phoneOtpService.send(user.phone, "login");

    return {
      message: "OTP sent to your phone",
      otpRequired: true,
      phone: normalizedPhone,          // pass this to /verify-otp
      otpExpiresAt: expiresAt,
      maskedPhone: maskPhoneNumber(normalizedPhone),
    };
  },

  verifyLoginOtp: async (data: { phone: string; otp: string }) => {
    const verification = await phoneOtpService.verify(data.phone, data.otp);

    // Verify OTP first — avoids leaking user existence on bad OTP

    if (!verification.valid) {
      switch (verification.reason) {
        case "NOT_FOUND":
          throw ApiError.badRequest("No verification code found. Request a new OTP.");
        case "EXPIRED":
          throw ApiError.badRequest("Verification code expired. Request a new OTP.");
        case "TOO_MANY_ATTEMPTS":
          throw ApiError.badRequest("Too many failed attempts. Request a new OTP.");
        case "MISMATCH":
        default:
          throw ApiError.badRequest("Invalid verification code.");
      }
    }

    // OTP valid — now load user by phone
    const normalizedPhone = normalizePhoneNumber(data.phone);
    const user = await userRepository.findByPhone(normalizedPhone);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    await refreshTokenRepository.create({
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

  refresh: async (token: string) => {
    try {
      verifyRefreshToken(token);
    } catch {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    const storedToken = await refreshTokenRepository.findByToken(token);

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw ApiError.unauthorized("Refresh token expired or revoked");
    }

    if (!storedToken.user.isActive) {
      throw ApiError.unauthorized("User account is inactive");
    }

    // Revoke old refresh token
    await refreshTokenRepository.revoke(token);

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      storedToken.user.id,
      storedToken.user.role
    );

    // Store new refresh token
    await refreshTokenRepository.create({
      token: newRefreshToken,
      userId: storedToken.user.id,
      expiresAt: calculateRefreshTokenExpiry(),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  logout: async (token: string) => {
    try {
      await refreshTokenRepository.revoke(token);
    } catch {
      // Token might not exist, that's fine
    }
  },

  forgotPassword: async (data: { phone: string }) => {
    const user = await userRepository.findByPhone(data.phone);
    // Always respond generically to avoid phone enumeration
    if (!user || !user.isActive) {
      return { message: "If that phone is registered, an OTP has been sent." };
    }

    const { normalizedPhone, expiresAt } = await phoneOtpService.send(
      user.phone!,
      "password reset"
    );

    return {
      message: "OTP sent to your phone",
      phone: normalizedPhone,
      maskedPhone: maskPhoneNumber(normalizedPhone),
      otpExpiresAt: expiresAt,
    };
  },

  resetPassword: async (data: { phone: string; otp: string; newPassword: string }) => {
    const verification = await phoneOtpService.verify(data.phone, data.otp);

    if (!verification.valid) {
      switch (verification.reason) {
        case "NOT_FOUND":
          throw ApiError.badRequest("No OTP found. Request a new one.");
        case "EXPIRED":
          throw ApiError.badRequest("OTP expired. Request a new one.");
        case "TOO_MANY_ATTEMPTS":
          throw ApiError.badRequest("Too many failed attempts. Request a new OTP.");
        case "MISMATCH":
        default:
          throw ApiError.badRequest("Invalid OTP.");
      }
    }

    const normalizedPhone = normalizePhoneNumber(data.phone);
    const user = await userRepository.findByPhone(normalizedPhone);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized("Invalid request.");
    }

    const hashed = await hashPassword(data.newPassword);
    await userRepository.updatePassword(user.id, hashed);

    return { message: "Password reset successfully. You can now log in." };
  },
};

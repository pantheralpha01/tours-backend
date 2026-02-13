import { userRepository } from "../users/user.repository";
import { refreshTokenRepository } from "./refresh-token.repository";
import { hashPassword, comparePassword } from "../../utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { ApiError } from "../../utils/ApiError";

const generateTokens = (userId: string, role: "ADMIN" | "AGENT" | "MANAGER") => {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId });
  return { accessToken, refreshToken };
};

const calculateRefreshTokenExpiry = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7); // 7 days from now
  return date;
};

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: "ADMIN" | "AGENT" | "MANAGER";
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
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
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

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    await refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: calculateRefreshTokenExpiry(),
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
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
};

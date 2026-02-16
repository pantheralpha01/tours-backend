"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const user_repository_1 = require("../users/user.repository");
const refresh_token_repository_1 = require("./refresh-token.repository");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const ApiError_1 = require("../../utils/ApiError");
const generateTokens = (userId, role) => {
    const accessToken = (0, jwt_1.signAccessToken)({ sub: userId, role });
    const refreshToken = (0, jwt_1.signRefreshToken)({ sub: userId });
    return { accessToken, refreshToken };
};
const calculateRefreshTokenExpiry = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 days from now
    return date;
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
    login: async (data) => {
        const user = await user_repository_1.userRepository.findByEmail(data.email);
        if (!user || !user.isActive) {
            throw ApiError_1.ApiError.unauthorized("Invalid credentials");
        }
        const ok = await (0, password_1.comparePassword)(data.password, user.password);
        if (!ok) {
            throw ApiError_1.ApiError.unauthorized("Invalid credentials");
        }
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        await refresh_token_repository_1.refreshTokenRepository.create({
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
};
//# sourceMappingURL=auth.service.js.map
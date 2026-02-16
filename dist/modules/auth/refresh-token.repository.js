"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.refreshTokenRepository = {
    create: (data) => prisma_1.prisma.refreshToken.create({
        data: {
            token: data.token,
            userId: data.userId,
            expiresAt: data.expiresAt,
        },
    }),
    findByToken: (token) => prisma_1.prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
    }),
    revoke: (token) => prisma_1.prisma.refreshToken.update({
        where: { token },
        data: { revoked: true },
    }),
    revokeAllForUser: (userId) => prisma_1.prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
    }),
    deleteExpired: () => prisma_1.prisma.refreshToken.deleteMany({
        where: {
            expiresAt: { lt: new Date() },
        },
    }),
};
//# sourceMappingURL=refresh-token.repository.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailActionRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.emailActionRepository = {
    createToken: (data) => prisma_1.prisma.emailActionToken.create({
        data: {
            userId: data.userId,
            tokenHash: data.tokenHash,
            type: data.type,
            expiresAt: data.expiresAt,
            metadata: data.metadata,
        },
    }),
    invalidateExisting: (userId, type) => prisma_1.prisma.emailActionToken.updateMany({
        where: {
            userId,
            type,
            usedAt: null,
            expiresAt: { gt: new Date() },
        },
        data: { usedAt: new Date() },
    }),
    findValidByHash: (tokenHash, type) => prisma_1.prisma.emailActionToken.findFirst({
        where: {
            tokenHash,
            type,
            usedAt: null,
            expiresAt: { gt: new Date() },
        },
        include: { user: true },
    }),
    markUsed: (id) => prisma_1.prisma.emailActionToken.update({
        where: { id },
        data: { usedAt: new Date() },
    }),
};
//# sourceMappingURL=email-action.repository.js.map
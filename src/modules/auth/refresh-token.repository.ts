import { prisma } from "../../config/prisma";

export const refreshTokenRepository = {
  create: (data: { token: string; userId: string; expiresAt: Date }) =>
    prisma.refreshToken.create({
      data: {
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    }),

  findByToken: (token: string) =>
    prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    }),

  revoke: (token: string) =>
    prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    }),

  revokeAllForUser: (userId: string) =>
    prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    }),

  deleteExpired: () =>
    prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    }),
};

import { EmailActionType, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const emailActionRepository = {
  createToken: (data: {
    userId: string;
    tokenHash: string;
    type: EmailActionType;
    expiresAt: Date;
    metadata?: Record<string, unknown>;
  }) =>
    prisma.emailActionToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        type: data.type,
        expiresAt: data.expiresAt,
        metadata: data.metadata as Prisma.JsonValue | undefined,
      },
    }),

  invalidateExisting: (userId: string, type: EmailActionType) =>
    prisma.emailActionToken.updateMany({
      where: {
        userId,
        type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    }),

  findValidByHash: (tokenHash: string, type: EmailActionType) =>
    prisma.emailActionToken.findFirst({
      where: {
        tokenHash,
        type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    }),

  markUsed: (id: string) =>
    prisma.emailActionToken.update({
      where: { id },
      data: { usedAt: new Date() },
    }),
};

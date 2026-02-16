export declare const refreshTokenRepository: {
    create: (data: {
        token: string;
        userId: string;
        expiresAt: Date;
    }) => import(".prisma/client").Prisma.Prisma__RefreshTokenClient<{
        id: string;
        createdAt: Date;
        expiresAt: Date;
        token: string;
        userId: string;
        revoked: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByToken: (token: string) => import(".prisma/client").Prisma.Prisma__RefreshTokenClient<({
        user: {
            name: string;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        expiresAt: Date;
        token: string;
        userId: string;
        revoked: boolean;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    revoke: (token: string) => import(".prisma/client").Prisma.Prisma__RefreshTokenClient<{
        id: string;
        createdAt: Date;
        expiresAt: Date;
        token: string;
        userId: string;
        revoked: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    revokeAllForUser: (userId: string) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    deleteExpired: () => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=refresh-token.repository.d.ts.map
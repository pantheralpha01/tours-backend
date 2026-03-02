export declare const refreshTokenRepository: {
    create: (data: {
        token: string;
        userId: string;
        expiresAt: Date;
    }) => import(".prisma/client").Prisma.Prisma__RefreshTokenClient<{
        id: string;
        createdAt: Date;
        expiresAt: Date;
        userId: string;
        token: string;
        revoked: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByToken: (token: string) => import(".prisma/client").Prisma.Prisma__RefreshTokenClient<({
        user: {
            name: string;
            id: string;
            email: string;
            emailVerified: boolean;
            emailVerifiedAt: Date | null;
            password: string;
            phone: string | null;
            phoneVerified: boolean;
            phoneVerifiedAt: Date | null;
            idNumber: string | null;
            idType: string | null;
            profilePicUrl: string | null;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            partnerId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        expiresAt: Date;
        userId: string;
        token: string;
        revoked: boolean;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    revoke: (token: string) => import(".prisma/client").Prisma.Prisma__RefreshTokenClient<{
        id: string;
        createdAt: Date;
        expiresAt: Date;
        userId: string;
        token: string;
        revoked: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    revokeAllForUser: (userId: string) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    deleteExpired: () => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=refresh-token.repository.d.ts.map
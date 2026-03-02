export declare const userRepository: {
    create: (data: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        idNumber?: string;
        idType?: string;
        profilePicUrl?: string;
        role?: "ADMIN" | "AGENT" | "MANAGER" | "PARTNER";
    }) => import(".prisma/client").Prisma.Prisma__UserClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByEmail: (email: string) => import(".prisma/client").Prisma.Prisma__UserClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__UserClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=user.repository.d.ts.map
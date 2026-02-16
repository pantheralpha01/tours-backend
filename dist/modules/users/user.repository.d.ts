export declare const userRepository: {
    create: (data: {
        name: string;
        email: string;
        password: string;
        role?: "ADMIN" | "AGENT" | "MANAGER";
    }) => import(".prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByEmail: (email: string) => import(".prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findById: (id: string) => import(".prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=user.repository.d.ts.map
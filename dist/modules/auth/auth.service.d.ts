export declare const authService: {
    register: (data: {
        name: string;
        email: string;
        password: string;
        role?: "ADMIN" | "AGENT" | "MANAGER";
    }) => Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login: (data: {
        email: string;
        password: string;
    }) => Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: true;
            createdAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh: (token: string) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout: (token: string) => Promise<void>;
};
//# sourceMappingURL=auth.service.d.ts.map
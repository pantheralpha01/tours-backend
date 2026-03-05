export declare const authService: {
    register: (data: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        idNumber?: string;
        idType?: string;
        profilePicUrl?: string;
        role?: "ADMIN" | "AGENT" | "MANAGER" | "PARTNER";
    }) => Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: "ADMIN" | "AGENT" | "MANAGER" | "PARTNER";
            phone: string | undefined;
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
        message: string;
        otpRequired: boolean;
        phone: string;
        otpExpiresAt: Date;
        maskedPhone: string;
    }>;
    verifyLoginOtp: (data: {
        phone: string;
        otp: string;
    }) => Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: "ADMIN" | "AGENT" | "MANAGER" | "PARTNER";
            phone: string | undefined;
            isActive: boolean;
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
    forgotPassword: (data: {
        phone: string;
    }) => Promise<{
        message: string;
        phone?: undefined;
        maskedPhone?: undefined;
        otpExpiresAt?: undefined;
    } | {
        message: string;
        phone: string;
        maskedPhone: string;
        otpExpiresAt: Date;
    }>;
    resetPassword: (data: {
        phone: string;
        otp: string;
        newPassword: string;
    }) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map
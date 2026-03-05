import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    idNumber: z.ZodOptional<z.ZodString>;
    idType: z.ZodOptional<z.ZodString>;
    profilePicUrl: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["ADMIN", "AGENT", "MANAGER"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    phone?: string | undefined;
    idNumber?: string | undefined;
    idType?: string | undefined;
    profilePicUrl?: string | undefined;
    role?: "ADMIN" | "AGENT" | "MANAGER" | undefined;
}, {
    name: string;
    email: string;
    password: string;
    phone?: string | undefined;
    idNumber?: string | undefined;
    idType?: string | undefined;
    profilePicUrl?: string | undefined;
    role?: "ADMIN" | "AGENT" | "MANAGER" | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const refreshSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const logoutSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const verifyLoginOtpSchema: z.ZodObject<{
    phone: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
    otp: string;
}, {
    phone: string;
    otp: string;
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
}, {
    phone: string;
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    phone: z.ZodString;
    otp: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
    otp: string;
    newPassword: string;
}, {
    phone: string;
    otp: string;
    newPassword: string;
}>;
//# sourceMappingURL=auth.validation.d.ts.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyLoginOtpSchema = exports.logoutSchema = exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    phone: zod_1.z.string().min(7).optional(),
    idNumber: zod_1.z.string().min(1).optional(),
    idType: zod_1.z.string().optional(),
    profilePicUrl: zod_1.z.string().url().optional(),
    role: zod_1.z.enum(["ADMIN", "AGENT", "MANAGER"]).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
exports.logoutSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
exports.verifyLoginOtpSchema = zod_1.z.object({
    phone: zod_1.z.string().min(7, "Phone number required"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    phone: zod_1.z.string().min(7, "Phone number required"),
});
exports.resetPasswordSchema = zod_1.z.object({
    phone: zod_1.z.string().min(7, "Phone number required"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
    newPassword: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
//# sourceMappingURL=auth.validation.js.map
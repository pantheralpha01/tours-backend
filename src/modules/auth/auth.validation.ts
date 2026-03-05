import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(7).optional(),
  idNumber: z.string().min(1).optional(),
  idType: z.string().optional(),
  profilePicUrl: z.string().url().optional(),
  role: z.enum(["ADMIN", "AGENT", "MANAGER"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

export const verifyLoginOtpSchema = z.object({
  phone: z.string().min(7, "Phone number required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  phone: z.string().min(7, "Phone number required"),
});

export const resetPasswordSchema = z.object({
  phone: z.string().min(7, "Phone number required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

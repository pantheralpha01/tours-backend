import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  verifyLoginOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";
import { userRepository } from "../users/user.repository";

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = registerSchema.parse(req.body);
      const result = await authService.register(payload);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await authService.login(payload);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);
      const result = await authService.refresh(refreshToken);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = logoutSchema.parse(req.body);
      await authService.logout(refreshToken);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  },

  verifyLoginOtp: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = verifyLoginOtpSchema.parse(req.body);
      const result = await authService.verifyLoginOtp(payload);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = forgotPasswordSchema.parse(req.body);
      const result = await authService.forgotPassword(payload);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = resetPasswordSchema.parse(req.body);
      const result = await authService.resetPassword(payload);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  me: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await userRepository.findById(req.user.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      });
    } catch (err) {
      next(err);
    }
  },
};

import { Request, Response } from "express";
import { authService } from "./auth.service";
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from "./auth.validation";
import { userRepository } from "../users/user.repository";

export const authController = {
  register: async (req: Request, res: Response) => {
    const payload = registerSchema.parse(req.body);
    const result = await authService.register(payload);
    return res.status(201).json(result);
  },

  login: async (req: Request, res: Response) => {
    const payload = loginSchema.parse(req.body);
    const result = await authService.login(payload);
    return res.status(200).json(result);
  },

  refresh: async (req: Request, res: Response) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    const result = await authService.refresh(refreshToken);
    return res.status(200).json(result);
  },

  logout: async (req: Request, res: Response) => {
    const { refreshToken } = logoutSchema.parse(req.body);
    await authService.logout(refreshToken);
    return res.status(200).json({ message: "Logged out successfully" });
  },

  me: async (req: Request, res: Response) => {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    });
  },
};

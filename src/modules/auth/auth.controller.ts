import { Request, Response } from "express";
import { authService } from "./auth.service";
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from "./auth.validation";

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
};

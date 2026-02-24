import { Request, Response } from "express";
import { dashboardService } from "./dashboard.service";
import { Role } from "@prisma/client";

export const dashboardController = {
  summary: async (req: Request, res: Response) => {
    const role = (req.user?.role ?? "AGENT") as Role;
    const agentId = role === "AGENT" ? req.user?.id : undefined;
    const summary = await dashboardService.getSummary({ role, agentId });
    return res.status(200).json(summary);
  },
};

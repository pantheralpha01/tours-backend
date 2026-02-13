import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

type Role = "ADMIN" | "AGENT" | "MANAGER";

export const requireRoles = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      throw ApiError.forbidden("Insufficient permissions");
    }
    return next();
  };
};

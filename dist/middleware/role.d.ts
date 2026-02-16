import { NextFunction, Request, Response } from "express";
type Role = "ADMIN" | "AGENT" | "MANAGER";
export declare const requireRoles: (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=role.d.ts.map
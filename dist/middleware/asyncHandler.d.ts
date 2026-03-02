import { Request, Response, NextFunction, RequestHandler } from "express";
/**
 * Wraps async route handlers and catches errors automatically
 * Usage: router.get("/path", asyncHandler(yourAsyncHandler))
 */
export declare const asyncHandler: (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=asyncHandler.d.ts.map
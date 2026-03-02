import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers and catches errors automatically
 * Usage: router.get("/path", asyncHandler(yourAsyncHandler))
 */
export const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

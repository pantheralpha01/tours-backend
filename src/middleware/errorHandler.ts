import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json(
      ApiResponse.error(
        "VALIDATION_ERROR",
        err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
      )
    );
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(ApiResponse.error(err.code, err.message));
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json(ApiResponse.error("DATABASE_ERROR", err.message));
  }

  // Default to 500 server error
  console.error("Unhandled error:", err);
  return res
    .status(500)
    .json(ApiResponse.error("INTERNAL_ERROR", "An unexpected error occurred"));
};

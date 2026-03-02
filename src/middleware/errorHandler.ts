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
  console.error("[ERROR]", err.name, err.message);

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

  // Handle Prisma validation errors
  if (err.name === "PrismaClientValidationError") {
    return res.status(400).json(
      ApiResponse.error("VALIDATION_ERROR", "Invalid data provided to database")
    );
  }

  // Handle Prisma known request errors (database errors)
  if (err.name === "PrismaClientKnownRequestError") {
    const anyErr = err as any;
    if (anyErr.code === "P2025") {
      return res.status(404).json(ApiResponse.error("NOT_FOUND", "Record not found"));
    }
    if (anyErr.code === "P2002") {
      return res.status(409).json(ApiResponse.error("CONFLICT", "Record already exists"));
    }
    if (anyErr.code === "P2003") {
      // Foreign key constraint
      const meta = anyErr.meta as any;
      const field = meta?.field_name || "related record";
      const message = `Invalid reference: The referenced ${field} does not exist`;
      return res.status(400).json(ApiResponse.error("FOREIGN_KEY_ERROR", message));
    }
    return res.status(400).json(
      ApiResponse.error("DATABASE_ERROR", "Database operation failed")
    );
  }

  // Handle Prisma initialization errors
  if (err.name === "PrismaClientInitializationError") {
    return res.status(500).json(
      ApiResponse.error("DATABASE_ERROR", "Unable to connect to database")
    );
  }

  // Handle network errors
  if (err.name === "NetworkError" || err.message.includes("ECONNREFUSED")) {
    return res.status(503).json(
      ApiResponse.error("SERVICE_UNAVAILABLE", "Service temporarily unavailable")
    );
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json(
      ApiResponse.error("INVALID_JSON", "Request body is not valid JSON")
    );
  }

  // Catch-all for unexpected errors
  console.error("[UNHANDLED ERROR]", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  return res.status(500).json(
    ApiResponse.error(
      "INTERNAL_ERROR",
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred"
    )
  );
};


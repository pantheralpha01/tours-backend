"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const errorHandler = (err, _req, res, _next) => {
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json(ApiResponse_1.ApiResponse.error("VALIDATION_ERROR", err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")));
    }
    // Handle custom API errors
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json(ApiResponse_1.ApiResponse.error(err.code, err.message));
    }
    // Handle Prisma errors
    if (err.name === "PrismaClientKnownRequestError") {
        return res.status(400).json(ApiResponse_1.ApiResponse.error("DATABASE_ERROR", err.message));
    }
    // Default to 500 server error
    console.error("Unhandled error:", err);
    return res
        .status(500)
        .json(ApiResponse_1.ApiResponse.error("INTERNAL_ERROR", "An unexpected error occurred"));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map
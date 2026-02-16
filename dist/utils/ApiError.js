"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, code, message) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = "ApiError";
    }
    static badRequest(message, code = "BAD_REQUEST") {
        return new ApiError(400, code, message);
    }
    static unauthorized(message = "Unauthorized", code = "UNAUTHORIZED") {
        return new ApiError(401, code, message);
    }
    static forbidden(message = "Forbidden", code = "FORBIDDEN") {
        return new ApiError(403, code, message);
    }
    static notFound(message = "Not found", code = "NOT_FOUND") {
        return new ApiError(404, code, message);
    }
    static internal(message = "Internal server error", code = "INTERNAL_ERROR") {
        return new ApiError(500, code, message);
    }
    static notImplemented(message = "Not implemented", code = "NOT_IMPLEMENTED") {
        return new ApiError(501, code, message);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map
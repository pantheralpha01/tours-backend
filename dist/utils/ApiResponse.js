"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(data, message) {
        return {
            success: true,
            data,
            ...(message && { message }),
        };
    }
    static error(code, message) {
        return {
            success: false,
            error: {
                code,
                message,
            },
        };
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map
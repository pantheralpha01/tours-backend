export declare class ApiError extends Error {
    statusCode: number;
    code: string;
    constructor(statusCode: number, code: string, message: string);
    static badRequest(message: string, code?: string): ApiError;
    static unauthorized(message?: string, code?: string): ApiError;
    static forbidden(message?: string, code?: string): ApiError;
    static notFound(message?: string, code?: string): ApiError;
    static internal(message?: string, code?: string): ApiError;
    static notImplemented(message?: string, code?: string): ApiError;
}
//# sourceMappingURL=ApiError.d.ts.map
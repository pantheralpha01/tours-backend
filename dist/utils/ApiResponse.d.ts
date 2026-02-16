export declare class ApiResponse {
    static success<T>(data: T, message?: string): {
        message?: string | undefined;
        success: boolean;
        data: T;
    };
    static error(code: string, message: string): {
        success: boolean;
        error: {
            code: string;
            message: string;
        };
    };
}
//# sourceMappingURL=ApiResponse.d.ts.map
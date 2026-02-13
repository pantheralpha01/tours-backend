export class ApiResponse {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      ...(message && { message }),
    };
  }

  static error(code: string, message: string) {
    return {
      success: false,
      error: {
        code,
        message,
      },
    };
  }
}

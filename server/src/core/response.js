/** Standardized API response helpers — ensures consistent response format across all endpoints */
export class ApiResponse {
  static success(res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  static created(res, data) {
    return ApiResponse.success(res, data, 201);
  }

  static error(res, message, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }

  static notFound(res, resource = 'Resource') {
    return ApiResponse.error(res, `${resource} not found`, 404);
  }

  static unauthorized(res, message = 'Authentication required') {
    return ApiResponse.error(res, message, 401);
  }

  static badRequest(res, message) {
    return ApiResponse.error(res, message, 400);
  }
}

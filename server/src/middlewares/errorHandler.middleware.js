import logger from '../core/logger.js';
import { ApiResponse } from '../core/response.js';

/**
 * Global error handler middleware — catches all errors thrown
 * by controllers/services and converts them to standardized API responses.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (!err.isOperational) {
    logger.error('Unhandled Error:', err.stack);
  }

  return ApiResponse.error(res, message, statusCode);
};

/**
 * Async handler wrapper — eliminates try/catch boilerplate in controllers.
 * Wraps async route handlers so rejected promises are passed to errorHandler.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

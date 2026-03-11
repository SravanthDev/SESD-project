import { ApiResponse } from '../../core/response.js';
import { asyncHandler } from '../../middlewares/errorHandler.middleware.js';
import authService from './auth.service.js';

/** Controller layer — SRP: only handles HTTP request/response, delegates logic to service */
class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    ApiResponse.created(res, result);
  });

  login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    ApiResponse.success(res, result);
  });

  getMe = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const result = await authService.verifyToken(token);
    ApiResponse.success(res, result);
  });
}

export default new AuthController();

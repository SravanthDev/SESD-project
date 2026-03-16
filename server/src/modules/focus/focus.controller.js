import { ApiResponse } from '../../core/response.js';
import { asyncHandler } from '../../middlewares/errorHandler.middleware.js';
import focusService from './focus.service.js';

class FocusController {
  getAll = asyncHandler(async (req, res) => {
    const sessions = await focusService.getSessions(req.userId, req.query.limit);
    ApiResponse.success(res, { sessions });
  });

  create = asyncHandler(async (req, res) => {
    const session = await focusService.createSession(req.userId, req.body);
    ApiResponse.created(res, { session });
  });
}

export default new FocusController();

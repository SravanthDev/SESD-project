import { ApiResponse } from '../../core/response.js';
import { asyncHandler } from '../../middlewares/errorHandler.middleware.js';
import statsService from './stats.service.js';

class StatsController {
  getDashboard = asyncHandler(async (req, res) => {
    const stats = await statsService.getDashboard(req.userId);
    ApiResponse.success(res, { stats });
  });

  getWeekly = asyncHandler(async (req, res) => {
    const weekData = await statsService.getWeekly(req.userId);
    ApiResponse.success(res, { weekData });
  });
}

export default new StatsController();

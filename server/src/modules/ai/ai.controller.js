import { ApiResponse } from '../../core/response.js';
import { asyncHandler } from '../../middlewares/errorHandler.middleware.js';
import aiService from './ai.service.js';

class AIController {
  planDay = asyncHandler(async (req, res) => {
    const plan = await aiService.planDay(req.userId);
    ApiResponse.success(res, { plan });
  });

  analyzeProductivity = asyncHandler(async (req, res) => {
    const analysis = await aiService.analyzeProductivity(req.userId);
    ApiResponse.success(res, { analysis });
  });

  summarizeJournal = asyncHandler(async (req, res) => {
    const summary = await aiService.summarizeJournal(req.userId, req.body.days);
    if (!summary) return ApiResponse.badRequest(res, 'No journal entries found');
    ApiResponse.success(res, { summary });
  });

  suggestImprovements = asyncHandler(async (req, res) => {
    const suggestions = await aiService.suggestImprovements(req.userId);
    ApiResponse.success(res, { suggestions });
  });
}

export default new AIController();

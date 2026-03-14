import { ApiResponse } from '../../core/response.js';
import { asyncHandler } from '../../middlewares/errorHandler.middleware.js';
import habitService from './habit.service.js';

class HabitController {
  getAll = asyncHandler(async (req, res) => {
    const habits = await habitService.getAll(req.userId);
    ApiResponse.success(res, { habits });
  });

  create = asyncHandler(async (req, res) => {
    const habit = await habitService.create(req.userId, req.body);
    ApiResponse.created(res, { habit });
  });

  complete = asyncHandler(async (req, res) => {
    const habit = await habitService.complete(req.userId, req.params.id);
    ApiResponse.success(res, { habit });
  });

  update = asyncHandler(async (req, res) => {
    const habit = await habitService.update(req.userId, req.params.id, req.body);
    ApiResponse.success(res, { habit });
  });

  delete = asyncHandler(async (req, res) => {
    const result = await habitService.delete(req.userId, req.params.id);
    ApiResponse.success(res, result);
  });
}

export default new HabitController();

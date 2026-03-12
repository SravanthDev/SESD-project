import { ApiResponse } from '../../core/response.js';
import { asyncHandler } from '../../middlewares/errorHandler.middleware.js';
import taskService from './task.service.js';

/** Controller — thin HTTP layer, delegates to TaskService */
class TaskController {
  getAll = asyncHandler(async (req, res) => {
    const tasks = await taskService.getTasks(req.userId, req.query);
    ApiResponse.success(res, { tasks });
  });

  getTop = asyncHandler(async (req, res) => {
    const tasks = await taskService.getTopPriority(req.userId);
    ApiResponse.success(res, { tasks });
  });

  create = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.userId, req.body);
    ApiResponse.created(res, { task });
  });

  update = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.userId, req.params.id, req.body);
    ApiResponse.success(res, { task });
  });

  delete = asyncHandler(async (req, res) => {
    const result = await taskService.deleteTask(req.userId, req.params.id);
    ApiResponse.success(res, result);
  });

  carryForward = asyncHandler(async (req, res) => {
    const result = await taskService.carryForward(req.userId);
    ApiResponse.success(res, result);
  });
}

export default new TaskController();

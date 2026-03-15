import { ApiResponse } from '../../core/response.js';
import { asyncHandler } from '../../middlewares/errorHandler.middleware.js';
import journalService from './journal.service.js';

class JournalController {
  getAll = asyncHandler(async (req, res) => {
    const journals = await journalService.getAll(req.userId, req.query.limit);
    ApiResponse.success(res, { journals });
  });

  getByDate = asyncHandler(async (req, res) => {
    const journal = await journalService.getByDate(req.userId, req.params.date);
    ApiResponse.success(res, { journal });
  });

  createOrUpdate = asyncHandler(async (req, res) => {
    const journal = await journalService.createOrUpdate(req.userId, req.body);
    ApiResponse.created(res, { journal });
  });

  delete = asyncHandler(async (req, res) => {
    const result = await journalService.delete(req.userId, req.params.id);
    ApiResponse.success(res, result);
  });
}

export default new JournalController();

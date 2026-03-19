import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import statsController from './stats.controller.js';

const router = Router();
router.use(authMiddleware);

router.get('/dashboard', statsController.getDashboard);
router.get('/weekly', statsController.getWeekly);

export default router;

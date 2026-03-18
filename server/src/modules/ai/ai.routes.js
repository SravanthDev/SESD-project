import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import aiController from './ai.controller.js';

const router = Router();
router.use(authMiddleware);

router.post('/plan-day', aiController.planDay);
router.post('/analyze-productivity', aiController.analyzeProductivity);
router.post('/summarize-journal', aiController.summarizeJournal);
router.post('/suggest-improvements', aiController.suggestImprovements);

export default router;

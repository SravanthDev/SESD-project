import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import focusController from './focus.controller.js';

const router = Router();
router.use(authMiddleware);

router.get('/', focusController.getAll);
router.post('/', focusController.create);

export default router;

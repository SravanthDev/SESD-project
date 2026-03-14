import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import habitController from './habit.controller.js';

const router = Router();
router.use(authMiddleware);

router.get('/', habitController.getAll);
router.post('/', habitController.create);
router.post('/:id/complete', habitController.complete);
router.patch('/:id', habitController.update);
router.delete('/:id', habitController.delete);

export default router;

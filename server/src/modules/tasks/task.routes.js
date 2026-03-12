import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import taskController from './task.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', taskController.getAll);
router.get('/top', taskController.getTop);
router.post('/', taskController.create);
router.patch('/:id', taskController.update);
router.delete('/:id', taskController.delete);
router.post('/carry-forward', taskController.carryForward);

export default router;

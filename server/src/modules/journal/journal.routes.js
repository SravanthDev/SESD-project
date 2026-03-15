import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import journalController from './journal.controller.js';

const router = Router();
router.use(authMiddleware);

router.get('/', journalController.getAll);
router.get('/date/:date', journalController.getByDate);
router.post('/', journalController.createOrUpdate);
router.delete('/:id', journalController.delete);

export default router;

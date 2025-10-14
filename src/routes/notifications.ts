import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as notifController from '../controllers/notificationController';

const router = Router();
router.get('/', authenticate, notifController.list);
router.post('/:id/read', authenticate, notifController.markRead);

export default router;

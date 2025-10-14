import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';
import * as userController from '../controllers/userController';

const router = Router();
router.post('/me', authenticate, userController.me);
router.get('/', authenticate, authorizeRoles('ADMIN'), userController.list);

export default router;

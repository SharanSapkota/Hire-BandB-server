import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as userController from '../controllers/userController';

const router = Router();
router.get('/me', authenticate, userController.getUserById);

export default router;

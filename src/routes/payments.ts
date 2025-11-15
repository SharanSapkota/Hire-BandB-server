import { Router } from 'express';
import * as payCtrl from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { rateLimitMiddleware } from '../middleware/rateLimit';
const router = Router();

router.get('/methods', rateLimitMiddleware, authenticate, payCtrl.listPaymentMethods);
router.post('/transactions', rateLimitMiddleware, authenticate, payCtrl.createPaymentTransaction);
router.get('/cost/:bikeId', rateLimitMiddleware, authenticate, payCtrl.calculateCostForRenter);

export default router;

import { Router } from 'express';
import { createStripeCustomer } from '../controllers/stripeController';
import { authenticate } from '../middleware/auth';
import { rateLimitMiddleware } from '../middleware/rateLimit';

const router = Router();

router.post('/create-stripe-customer', rateLimitMiddleware, authenticate, createStripeCustomer);

export default router;


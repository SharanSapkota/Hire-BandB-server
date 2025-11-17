import { Router } from 'express';
import { createStripeCustomer, stripeWebhook } from '../controllers/stripeController';
import { authenticate } from '../middleware/auth';
import { rateLimitMiddleware } from '../middleware/rateLimit';

const router = Router();

router.post('/create-stripe-customer', rateLimitMiddleware, authenticate, createStripeCustomer);
router.post('/stripe-webhook', rateLimitMiddleware, authenticate, stripeWebhook);

export default router;


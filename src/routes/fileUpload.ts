import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.get('/', authenticate, bookingController.list);
router.get('/:id', authenticate, bookingController.get);
router.post('/', authenticate, bookingController.create);
router.put('/:id', authenticate, bookingController.update);
router.delete('/:id', authenticate, bookingController.remove);

export default router;

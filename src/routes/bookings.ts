import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.get('/', authenticate, bookingController.list);
router.get('/my', authenticate, bookingController.listMyBookings);
router.get('/:id', authenticate, bookingController.get);
router.put('/:id/approve', authenticate, bookingController.approveBooking);
router.put('/:id/reject', authenticate, bookingController.rejectBooking);
router.post('/', authenticate, bookingController.create);
router.put('/:id', authenticate, bookingController.update);
router.delete('/:id', authenticate, bookingController.remove);

export default router;

import { Router } from 'express';
import * as bikeController from '../controllers/bikeController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.get('/', bikeController.list);
router.get('/:id', bikeController.get);
router.post('/', authenticate, bikeController.create);
router.put('/:id', authenticate, bikeController.update);
router.delete('/:id', authenticate, bikeController.remove);

export default router;

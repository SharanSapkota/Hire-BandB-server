import { Router } from 'express';
import * as locCtrl from '../controllers/locationController';

const router = Router();

router.get('/users/:userId', locCtrl.list);
router.post('/users/:userId', locCtrl.create);
router.delete('/:id', locCtrl.remove);

export default router;

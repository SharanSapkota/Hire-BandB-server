import { Router } from 'express';
import * as ctrl from '../controllers/userEmailController';

const router = Router();

router.get('/:userId', ctrl.list);
router.post('/:userId', ctrl.create);
router.post('/:userId/:id/primary', ctrl.setPrimary);

export default router;

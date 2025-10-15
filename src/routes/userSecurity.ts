import { Router } from 'express';
import * as ctrl from '../controllers/userSecurityController';

const router = Router();

router.get('/:userId', ctrl.get);
router.post('/:userId', ctrl.upsert);
router.put('/:userId', ctrl.upsert);

export default router;

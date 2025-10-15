import { Router } from 'express';
import * as upCtrl from '../controllers/userPaymentController';

const router = Router();

router.get('/:userId', upCtrl.list);
router.post('/:userId', upCtrl.create);

export default router;

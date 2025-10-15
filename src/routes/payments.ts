import { Router } from 'express';
import * as payCtrl from '../controllers/paymentController';

const router = Router();

router.get('/methods', payCtrl.listMethods);
router.post('/methods', payCtrl.createMethod);
router.get('/transactions', payCtrl.listTransactions);
router.post('/transactions', payCtrl.createTransaction);

export default router;

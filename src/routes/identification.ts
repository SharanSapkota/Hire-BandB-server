import { Router } from 'express';
import * as idCtrl from '../controllers/identificationController';

const router = Router();

router.get('/services', idCtrl.listServices);
router.post('/services', idCtrl.createService);
router.post('/users/:userId', idCtrl.createIdentity);
router.get('/users/:userId', idCtrl.listIdentities);

export default router;

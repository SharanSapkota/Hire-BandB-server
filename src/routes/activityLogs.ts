import { Router } from 'express';
import * as logCtrl from '../controllers/activityLogController';

const router = Router();

router.get('/users/:userId', logCtrl.list);
router.post('/users/:userId', logCtrl.create);

export default router;

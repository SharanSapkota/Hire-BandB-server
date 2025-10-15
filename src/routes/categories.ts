import { Router } from 'express';
import * as catCtrl from '../controllers/categoryController';

const router = Router();

router.get('/', catCtrl.list);
router.post('/', catCtrl.create);

export default router;

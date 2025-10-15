import { Router } from 'express';
import * as phoneCtrl from '../controllers/userPhoneController';

const router = Router();

router.get('/:userId', phoneCtrl.list);
router.post('/:userId', phoneCtrl.create);
router.put('/:id', phoneCtrl.update);
router.delete('/:id', phoneCtrl.remove);

export default router;

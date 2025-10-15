import { Router } from 'express';
import * as rentCtrl from '../controllers/rentalController';

const router = Router();

router.get('/', rentCtrl.list);
router.get('/:id', rentCtrl.get);
router.post('/', rentCtrl.create);
router.put('/:id', rentCtrl.update);
router.delete('/:id', rentCtrl.remove);

export default router;

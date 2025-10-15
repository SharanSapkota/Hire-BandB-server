import { Router } from 'express';
import * as roleCtrl from '../controllers/roleController';

const router = Router();

router.get('/', roleCtrl.list);
router.get('/:id', roleCtrl.get);
router.post('/', roleCtrl.create);
router.put('/:id', roleCtrl.update);
router.delete('/:id', roleCtrl.remove);

export default router;

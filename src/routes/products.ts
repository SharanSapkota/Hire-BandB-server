import { Router } from 'express';
import * as prodCtrl from '../controllers/productController';

const router = Router();

router.get('/', prodCtrl.list);
router.get('/:id', prodCtrl.get);
router.post('/', prodCtrl.create);
router.put('/:id', prodCtrl.update);
router.delete('/:id', prodCtrl.remove);

export default router;

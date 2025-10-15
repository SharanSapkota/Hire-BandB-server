import { Router } from 'express';
import * as permCtrl from '../controllers/permissionController';

const router = Router();

router.get('/', permCtrl.list);
router.get('/:id', permCtrl.get);
router.post('/', permCtrl.create);
router.put('/:id', permCtrl.update);
router.delete('/:id', permCtrl.remove);

export default router;

import { Router } from 'express';
import * as revCtrl from '../controllers/reviewController';

const router = Router();

router.get('/product/:productId', revCtrl.listByProduct);
router.post('/', revCtrl.create);

export default router;

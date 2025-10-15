import { Router } from 'express';
import * as assetCtrl from '../controllers/productAssetController';

const router = Router();

router.get('/images/:productId', assetCtrl.listImages);
router.post('/images', assetCtrl.createImage);
router.post('/prices', assetCtrl.createPrice);
router.get('/prices', assetCtrl.listPrices);
router.post('/assigned', assetCtrl.createAssigned);
router.get('/assigned/:ownerId', assetCtrl.listAssigned);

export default router;

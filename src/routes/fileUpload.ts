import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getPreSignedUploadUrl } from '../controllers/fileUploadController';

const router = Router();
router.get('/presigned', authenticate, getPreSignedUploadUrl);

export default router;

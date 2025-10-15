import { Router } from 'express';
import * as ctrl from '../controllers/permissionMappingController';

const router = Router();

router.get('/users', ctrl.listUserPermissions);
router.post('/users', ctrl.createUserPermission);
router.get('/roles', ctrl.listRolePermissions);
router.post('/roles', ctrl.createRolePermission);

export default router;

import { Router } from 'express';
import * as bikeController from '../controllers/bikeController';
import { authenticate } from '../middleware/auth';
import { uploadBikeImages } from '../middleware/upload';

const router = Router();
/**
 * @openapi
 * /api/bikes:
 *   get:
 *     summary: List bikes
 *     tags:
 *       - Bikes
 *     responses:
 *       200:
 *         description: Array of bikes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bike'
 */
router.get('/', bikeController.list);
router.get('/:id', bikeController.get);
/**
 * @openapi
 * /api/bikes:
 *   post:
 *     summary: Create a bike
 *     tags:
 *       - Bikes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BikeCreate'
 *     responses:
 *       201:
 *         description: Bike created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bike'
 */
router.post('/', authenticate, uploadBikeImages.array('images', 5), bikeController.create);
router.put('/:id', authenticate, uploadBikeImages.array('images', 5), bikeController.update);
router.delete('/:id', authenticate, bikeController.remove);

export default router;

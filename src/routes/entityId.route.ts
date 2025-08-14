import { Router } from 'express';
import { generateEntityIdController } from '../controllers/entityId.controller';

const router = Router();

/**
 * @swagger
 * /api/entity-id/generate:
 *   get:
 *     summary: Generate a unique entity ID
 *     description: Generates a unique entity ID by combining the entity name with a random 10-digit number
 *     tags: [Entity ID]
 *     parameters:
 *       - in: query
 *         name: entityName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the entity (e.g., 'ASSET', 'SUPPLIER', 'SR')
 *         example: "ASSET"
 *     responses:
 *       200:
 *         description: Entity ID generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     entityId:
 *                       type: string
 *                       description: The generated entity ID
 *                       example: "ASSET1234567890"
 *                     entityName:
 *                       type: string
 *                       description: The entity name used for generation
 *                       example: "ASSET"
 *                     generatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the ID was generated
 *                       example: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Bad request - entityName is required and must be a string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "entityName is required and must be a string"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error while generating entity ID"
 */
router.get('/generate', generateEntityIdController);

export default router;

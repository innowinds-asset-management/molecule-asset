import { Router } from 'express';
import { getAllUnitMeasuresController } from '../controllers/unitMeasure.controller';

const router = Router();

/**
 * @swagger
 * /api/unit-measures:
 *   get:
 *     summary: Get all unit measures
 *     description: Retrieve a list of all available unit measures
 *     tags: [UnitMeasures]
 *     responses:
 *       200:
 *         description: List of unit measures retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *                     description: The unit measure value (enum value)
 *                   label:
 *                     type: string
 *                     description: The display label for the unit measure
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllUnitMeasuresController);

export default router;

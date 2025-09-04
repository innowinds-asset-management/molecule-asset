import { Router } from 'express';
import {
  createSupplierController,
  deleteSupplierController,
  getSupplierByIdController,
  linkConsumerToSupplierController,
  listConsumersForSupplierController,
  unlinkConsumerFromSupplierController,
  updateSupplierController,
  listSuppliersOfConsumerWithStatsController,
  getSupplierDetailsByIdController,
  listSuppliersController,
  searchSuppliersController,
  createDefaultSupplierSignUpController
} from '../controllers/supplier.controller';

const router = Router();

router.get('/', listSuppliersOfConsumerWithStatsController);
router.get('/all', listSuppliersController);

/**
 * @swagger
 * /api/supplier/search:
 *   get:
 *     summary: Search suppliers by consumer
 *     description: Search suppliers by name or code for a specific consumer
 *     tags: [Supplier]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term (minimum 1 character)
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   supplier:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       code:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *       400:
 *         description: Bad request - missing parameters or invalid search term
 *       500:
 *         description: Internal server error
 */
router.get('/search', searchSuppliersController);

router.post('/', createSupplierController);

router.post('/signUpCreate', createDefaultSupplierSignUpController);


// More specific routes first
router.get('/:id/details', getSupplierDetailsByIdController);
router.get('/:id/consumers', listConsumersForSupplierController);
router.post('/:id/consumers', linkConsumerToSupplierController);
router.delete('/:id/consumers', unlinkConsumerFromSupplierController);

// Generic ID routes last
router.get('/:id', getSupplierByIdController);
router.put('/:id', updateSupplierController);
router.delete('/:id', deleteSupplierController);

export default router;




//warranty routes

import { Router } from 'express';
import { 
  getAllWarrantiesController, 
  getWarrantyByIdController, 
  createWarrantyController, 
  updateWarrantyController, 
  deleteWarrantyController,
  getWarrantiesByAssetIdController,
  getAllWarrantyTypesController,
  getWarrantyTypeByIdController,
  createWarrantyTypeController,
  updateWarrantyTypeController,
  deleteWarrantyTypeController
} from '../controllers/warranty.controller';

const router = Router();

/**
 * @swagger
 * /api/warranty:
 *   get:
 *     summary: Get all warranties
 *     description: Retrieve a list of all warranties with their related data
 *     tags: [Warranties]
 *     responses:
 *       200:
 *         description: List of warranties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warranty'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllWarrantiesController);

/**
 * @swagger
 * /api/warranty/asset/{assetId}:
 *   get:
 *     summary: Get warranties by asset ID
 *     description: Retrieve all warranties for a specific asset
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset
 *     responses:
 *       200:
 *         description: Warranties for asset retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warranty'
 *       400:
 *         description: Bad request - asset ID is required
 *       500:
 *         description: Internal server error
 */
router.get('/asset/:assetId', getWarrantiesByAssetIdController);

/**
 * @swagger
 * /api/warranty:
 *   post:
 *     summary: Create a new warranty
 *     description: Create a new warranty with the provided information
 *     tags: [Warranties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetId
 *               - warrantyTypeId
 *               - startDate
 *               - endDate
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset this warranty belongs to
 *               warrantyTypeId:
 *                 type: integer
 *                 description: ID of the warranty type
 *               warrantySupplierId:
 *                 type: string
 *                 description: Supplier ID for the warranty
 *               warrantyNumber:
 *                 type: string
 *                 description: Warranty number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the warranty
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the warranty
 *               warrantyPeriod:
 *                 type: integer
 *                 description: Warranty period in months
 *               coverageType:
 *                 type: string
 *                 description: Type of coverage
 *               coverageDescription:
 *                 type: string
 *                 description: Description of coverage
 *               termsConditions:
 *                 type: string
 *                 description: Terms and conditions
 *               cost:
 *                 type: number
 *                 description: Cost of the warranty
 *               isActive:
 *                 type: boolean
 *                 description: Whether the warranty is active
 *               autoRenewal:
 *                 type: boolean
 *                 description: Whether the warranty auto-renews
 *               consumerId:
 *                 type: integer
 *                 description: Consumer ID
 *               supplierId:
 *                 type: integer
 *                 description: Supplier ID
 *     responses:
 *       201:
 *         description: Warranty created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warranty'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', createWarrantyController);

/**
 * @swagger
 * /api/warranty/{id}:
 *   put:
 *     summary: Update a warranty
 *     description: Update an existing warranty with the provided information
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the warranty to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset this warranty belongs to
 *               warrantyTypeId:
 *                 type: integer
 *                 description: ID of the warranty type
 *               warrantySupplierId:
 *                 type: string
 *                 description: Supplier ID for the warranty
 *               warrantyNumber:
 *                 type: string
 *                 description: Warranty number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the warranty
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the warranty
 *               warrantyPeriod:
 *                 type: integer
 *                 description: Warranty period in months
 *               coverageType:
 *                 type: string
 *                 description: Type of coverage
 *               coverageDescription:
 *                 type: string
 *                 description: Description of coverage
 *               termsConditions:
 *                 type: string
 *                 description: Terms and conditions
 *               cost:
 *                 type: number
 *                 description: Cost of the warranty
 *               isActive:
 *                 type: boolean
 *                 description: Whether the warranty is active
 *               autoRenewal:
 *                 type: boolean
 *                 description: Whether the warranty auto-renews
 *               consumerId:
 *                 type: integer
 *                 description: Consumer ID
 *               supplierId:
 *                 type: integer
 *                 description: Supplier ID
 *     responses:
 *       200:
 *         description: Warranty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warranty'
 *       400:
 *         description: Bad request - invalid input data
 *       404:
 *         description: Warranty not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateWarrantyController);

/**
 * @swagger
 * /api/warranty/{id}:
 *   delete:
 *     summary: Delete a warranty
 *     description: Delete a warranty by its ID
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the warranty to delete
 *     responses:
 *       200:
 *         description: Warranty deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warranty'
 *       400:
 *         description: Bad request - warranty ID is required
 *       404:
 *         description: Warranty not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteWarrantyController);

// Warranty Type Routes
/**
 * @swagger
 * /api/warranty/types:
 *   get:
 *     summary: Get all warranty types
 *     description: Retrieve a list of all warranty types
 *     tags: [Warranty Types]
 *     responses:
 *       200:
 *         description: List of warranty types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WarrantyType'
 *       500:
 *         description: Internal server error
 */
router.get('/types', getAllWarrantyTypesController);

/**
 * @swagger
 * /api/warranty/types/{id}:
 *   get:
 *     summary: Get warranty type by ID
 *     description: Retrieve a specific warranty type by its ID
 *     tags: [Warranty Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the warranty type
 *     responses:
 *       200:
 *         description: Warranty type retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarrantyType'
 *       400:
 *         description: Bad request - warranty type ID is required
 *       404:
 *         description: Warranty type not found
 *       500:
 *         description: Internal server error
 */
router.get('/type/:id', getWarrantyTypeByIdController);

/**
 * @swagger
 * /api/warranty/types:
 *   post:
 *     summary: Create a new warranty type
 *     description: Create a new warranty type with the provided information
 *     tags: [Warranty Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeName
 *             properties:
 *               typeName:
 *                 type: string
 *                 description: Name of the warranty type
 *               description:
 *                 type: string
 *                 description: Description of the warranty type
 *     responses:
 *       201:
 *         description: Warranty type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarrantyType'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/type', createWarrantyTypeController);

/**
 * @swagger
 * /api/warranty/types/{id}:
 *   put:
 *     summary: Update a warranty type
 *     description: Update an existing warranty type with the provided information
 *     tags: [Warranty Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the warranty type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeName:
 *                 type: string
 *                 description: Name of the warranty type
 *               description:
 *                 type: string
 *                 description: Description of the warranty type
 *     responses:
 *       200:
 *         description: Warranty type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarrantyType'
 *       400:
 *         description: Bad request - invalid input data
 *       404:
 *         description: Warranty type not found
 *       500:
 *         description: Internal server error
 */
router.put('/type/:id', updateWarrantyTypeController);

/**
 * @swagger
 * /api/warranty/types/{id}:
 *   delete:
 *     summary: Delete a warranty type
 *     description: Delete a warranty type by its ID
 *     tags: [Warranty Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the warranty type to delete
 *     responses:
 *       200:
 *         description: Warranty type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarrantyType'
 *       400:
 *         description: Bad request - warranty type ID is required
 *       404:
 *         description: Warranty type not found
 *       500:
 *         description: Internal server error
 */
router.delete('/type/:id', deleteWarrantyTypeController);

/**
 * @swagger
 * /api/warranty/{id}:
 *   get:
 *     summary: Get warranty by ID
 *     description: Retrieve a specific warranty by its ID
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the warranty
 *     responses:
 *       200:
 *         description: Warranty retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warranty'
 *       400:
 *         description: Bad request - warranty ID is required
 *       404:
 *         description: Warranty not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getWarrantyByIdController);



export default router;


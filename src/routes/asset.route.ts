//asset routes

import { Router } from 'express';
import { getAllAssetsController, getAssetByIdController, updateAssetController, deleteAssetController, createAssetFromGrnAndPoLineItemController, createAssetWithWarrantyController, getAssetCountByStatusController, updateAssetWarrantyController } from '../controllers/asset.controller';

const router = Router();

/**
 * @swagger
 * /api/asset:
 *   get:
 *     summary: Get all assets
 *     description: Retrieve a list of all assets with optional filtering by supplierId and departmentId
 *     tags: [Assets]
 *     parameters:
 *       - in: query
 *         name: supplierId
 *         schema:
 *           type: string
 *         description: Filter assets by supplier ID
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter assets by department ID
 *     responses:
 *       200:
 *         description: List of assets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllAssetsController);

/**
 * @swagger
 * /api/asset/count/status:
 *   get:
 *     summary: Get asset counts by status
 *     description: Retrieve counts of assets grouped by status (active, retired, pre-active)
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: Asset counts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     active:
 *                       type: number
 *                       description: Count of active assets
 *                     retired:
 *                       type: number
 *                       description: Count of retired assets
 *                     preActive:
 *                       type: number
 *                       description: Count of pre-active assets (installation_pending, received, installed)
 *                     totalWithStatus:
 *                       type: number
 *                       description: Total assets with any status
 *                     totalWithoutStatus:
 *                       type: number
 *                       description: Total assets without status
 *                     grandTotal:
 *                       type: number
 *                       description: Total of all assets
 *       500:
 *         description: Internal server error
 */
router.get('/count/status', getAssetCountByStatusController);

/**
 * @swagger
 * /api/asset/{id}:
 *   get:
 *     summary: Get asset by ID
 *     description: Retrieve a specific asset by its ID
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset
 *     responses:
 *       200:
 *         description: Asset retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Bad request - asset ID is required
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getAssetByIdController);



/**
 * @swagger
 * /api/asset/{id}:
 *   put:
 *     summary: Update an asset
 *     description: Update an existing asset with the provided information
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAssetDto'
 *     responses:
 *       200:
 *         description: Asset updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Bad request - invalid input data
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateAssetController);

/**
 * @swagger
 * /api/asset/{id}:
 *   delete:
 *     summary: Delete an asset
 *     description: Delete an asset by its ID
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset to delete
 *     responses:
 *       200:
 *         description: Asset deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Bad request - asset ID is required
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteAssetController);




/**
 * @swagger
 * /api/asset/grn-po-line-item:
 *   post:
 *     summary: Create assets from GRN and PO Line Item
 *     description: Create assets from GRN and PO Line Item with the provided information
 *     tags: [Assets]   
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAssetFromGrnAndPoLineItemDto'  
 *     responses:
 *       201:
 *         description: Assets created successfully
 *         content:
 *           application/json:
 *             schema:          
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/grn-po-line-item', createAssetFromGrnAndPoLineItemController);

/** 
 * @swagger
 * /api/asset/warranty:
 *   post:
 *     summary: Create assets with warranty
 *     description: Create assets with warranty with the provided information
 *     tags: [Assets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAssetWithWarrantyDto'
 *     responses:
 *       201:
 *         description: Assets created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/warranty', createAssetWithWarrantyController);

/**
 * @swagger
 * /api/asset/{assetId}/warranty:
 *   put:
 *     summary: Update asset and warranty
 *     description: Update asset status, department and warranty information for a specific asset
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consumerId
 *               - asset
 *               - warranty
 *             properties:
 *               consumerId:
 *                 type: string
 *                 description: Consumer ID for validation
 *               asset:
 *                 type: object
 *                 required:
 *                   - assetId
 *                   - consumerId
 *                 properties:
 *                   assetId:
 *                     type: string
 *                     description: Asset ID
 *                   status:
 *                     type: string
 *                     description: Asset status (e.g., active, retired)
 *                   departmentId:
 *                     type: string
 *                     description: Department ID
 *                   consumerId:
 *                     type: string
 *                     description: Consumer ID
 *               warranty:
 *                 type: object
 *                 required:
 *                   - warrantyTypeId
 *                   - startDate
 *                   - endDate
 *                   - warrantyPeriod
 *                   - coverageType
 *                   - consumerId
 *                 properties:
 *                   warrantyTypeId:
 *                     type: integer
 *                     description: Warranty type ID
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     description: Warranty start date (YYYY-MM-DD)
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     description: Warranty end date (YYYY-MM-DD)
 *                   warrantyPeriod:
 *                     type: integer
 *                     description: Warranty period in months
 *                   coverageType:
 *                     type: string
 *                     description: Type of coverage (e.g., parts, labor, comprehensive)
 *                   consumerId:
 *                     type: string
 *                     description: Consumer ID
 *     responses:
 *       200:
 *         description: Asset and warranty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 asset:
 *                   $ref: '#/components/schemas/Asset'
 *                 warranty:
 *                   $ref: '#/components/schemas/Warranty'
 *       400:
 *         description: Bad request - missing required fields
 *       404:
 *         description: Asset not found for the given consumer
 *       500:
 *         description: Internal server error
 */
router.put('/:assetId/warranty', updateAssetWarrantyController);

export default router;
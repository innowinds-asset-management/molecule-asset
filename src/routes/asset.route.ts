//asset routes

import { Router } from 'express';
import { getAllAssetsController, getAssetByIdController, createAssetController, updateAssetController, deleteAssetController, createAssetCompleteController, createAssetFromGrnAndPoLineItemController, createAssetWithWarrantyController } from '../controllers/asset.controller';

const router = Router();

/**
 * @swagger
 * /api/asset:
 *   get:
 *     summary: Get all assets
 *     description: Retrieve a list of all assets
 *     tags: [Assets]
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
 * /api/asset:
 *   post:
 *     summary: Create a new asset
 *     description: Create a new asset with the provided information
 *     tags: [Assets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAssetDto'
 *     responses:
 *       201:
 *         description: Asset created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', createAssetController);

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
 * /api/asset/complete:
 *   post:
 *     summary: Create assets with locations and installations (Batch)
 *     description: Create multiple assets with their associated locations and installations in a single transaction. This is a high-performance batch operation that creates assets, locations, and installations atomically.
 *     tags: [Assets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAssetCompleteDto'
 *           example:
 *             - assetTypeId: "asset_type_1"
 *               assetSubTypeId: "asset_subtype_1"
 *               assetName: "Laptop Dell XPS 15"
 *               consumerId: "consumer_1"
 *               departmentId: "dept_1"
 *               building: "Building A"
 *               floorNumber: "2"
 *               roomNumber: "201"
 *               isCurrentLocation: true
 *               installationDate: "2024-01-15T10:00:00Z"
 *               brand: "Dell"
 *               model: "XPS 15"
 *               isActive: true
 *             - assetTypeId: "asset_type_1"
 *               assetSubTypeId: "asset_subtype_2"
 *               assetName: "Printer HP LaserJet"
 *               consumerId: "consumer_1"
 *               departmentId: "dept_2"
 *               building: "Building B"
 *               floorNumber: "1"
 *               roomNumber: "105"
 *               isCurrentLocation: true
 *               installationDate: "2024-01-20T14:30:00Z"
 *               brand: "HP"
 *               model: "LaserJet Pro"
 *               isActive: true
 *     responses:
 *       201:
 *         description: Assets with locations and installations created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssetComplete'
 *             example:
 *               assets:
 *                 - id: "asset_1"
 *                   assetName: "Laptop Dell XPS 15"
 *                   assetTypeId: "asset_type_1"
 *                   assetSubTypeId: "asset_subtype_1"
 *                   consumerId: "consumer_1"
 *                   isActive: true
 *               locations:
 *                 - id: "location_1"
 *                   assetId: "asset_1"
 *                   departmentId: "dept_1"
 *                   building: "Building A"
 *                   floorNumber: "2"
 *                   roomNumber: "201"
 *                   isCurrentLocation: true
 *               installations:
 *                 - id: "installation_1"
 *                   assetId: "asset_1"
 *                   locationId: "location_1"
 *                   departmentId: "dept_1"
 *                   installationDate: "2024-01-15T10:00:00Z"
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/complete', createAssetCompleteController);


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

export default router;
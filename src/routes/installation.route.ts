// src/routes/installation.route.ts

import { Router } from 'express';
import { 
  getAllInstallationsController, 
  getInstallationByIdController, 
  getInstallationByAssetIdController, 
  createInstallationController, 
  updateInstallationController, 
  deleteInstallationController 
} from '../controllers/installation.controller';

const router = Router();

/**
 * @swagger
 * /api/installation:
 *   get:
 *     summary: Get all installations
 *     description: Retrieve a list of all installations
 *     tags: [Installations]
 *     responses:
 *       200:
 *         description: List of installations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Installation'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllInstallationsController);

/**
 * @swagger
 * /api/installation/{id}:
 *   get:
 *     summary: Get installation by ID
 *     description: Retrieve a specific installation by its ID
 *     tags: [Installations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the installation
 *     responses:
 *       200:
 *         description: Installation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Installation'
 *       400:
 *         description: Bad request - installation ID is required
 *       404:
 *         description: Installation not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getInstallationByIdController);

/**
 * @swagger
 * /api/installation/asset/{assetId}:
 *   get:
 *     summary: Get installations by asset ID
 *     description: Retrieve all installations for a specific asset
 *     tags: [Installations]
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset
 *     responses:
 *       200:
 *         description: List of installations for the asset retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Installation'
 *       400:
 *         description: Bad request - asset ID is required
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.get('/asset/:assetId', getInstallationByAssetIdController);

/**
 * @swagger
 * /api/installation:
 *   post:
 *     summary: Create a new installation
 *     description: Create a new installation record with the provided information
 *     tags: [Installations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstallationDto'
 *     responses:
 *       201:
 *         description: Installation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Installation'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', createInstallationController);

/**
 * @swagger
 * /api/installation/{id}:
 *   put:
 *     summary: Update an installation
 *     description: Update an existing installation with the provided information
 *     tags: [Installations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the installation to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInstallationDto'
 *     responses:
 *       200:
 *         description: Installation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Installation'
 *       400:
 *         description: Bad request - invalid input data
 *       404:
 *         description: Installation not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateInstallationController);

/**
 * @swagger
 * /api/installation/{id}:
 *   delete:
 *     summary: Delete an installation
 *     description: Delete an installation by its ID
 *     tags: [Installations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the installation to delete
 *     responses:
 *       200:
 *         description: Installation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Installation'
 *       400:
 *         description: Bad request - installation ID is required
 *       404:
 *         description: Installation not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteInstallationController);

export default router; 
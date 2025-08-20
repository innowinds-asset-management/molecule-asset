//inventory routes

import { Router } from 'express';
import { getAllInventoryController, getInventoryByIdController, createOrUpdateInventoryController, searchInventoryController } from '../controllers/inventory.controller';
import { getAllUnitMeasuresController } from '../controllers/unitMeasure.controller';

const router = Router();

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items
 *     description: Retrieve a list of all inventory items with optional filtering by consumerId
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: consumerId
 *         schema:
 *           type: string
 *         description: Filter inventory items by consumer ID
 *     responses:
 *       200:
 *         description: List of inventory items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventory'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllInventoryController);

/**
 * @swagger
 * /api/inventory/search:
 *   get:
 *     summary: Search inventory items
 *     description: Search inventory items by item name or item number
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term (minimum 2 characters)
 *       - in: query
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Consumer ID
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
 *                   id:
 *                     type: string
 *                   itemName:
 *                     type: string
 *                   itemNo:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   unitMeasure:
 *                     type: string
 *       400:
 *         description: Bad request - missing parameters or invalid search term
 *       500:
 *         description: Internal server error
 */
router.get('/search', searchInventoryController);

/**
 * @swagger
 * /api/inventory/unit-measures:
 *   get:
 *     summary: Get all unit measures
 *     description: Retrieve a list of all available unit measures
 *     tags: [Inventory]
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
router.get('/unit-measures', getAllUnitMeasuresController);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Get inventory item by ID
 *     description: Retrieve a specific inventory item by its ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item
 *     responses:
 *       200:
 *         description: Inventory item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Bad request - inventory ID is required
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getInventoryByIdController);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create or update inventory item
 *     description: Create a new inventory item or update existing one by increasing quantity
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID of existing inventory item (optional - if provided, quantity will be increased)
 *               itemName:
 *                 type: string
 *                 description: Name of the inventory item
 *                 required: true
 *               quantity:
 *                 type: number
 *                 description: Quantity to add or create
 *                 required: true
 *               unitMeasure:
 *                 type: string
 *                 enum: [PIECE, BOX, PACK, LITER, MILLILITER, GRAM, KILOGRAM, TABLET, STRIP, VIAL, AMPULLE]
 *                 description: Unit of measurement
 *               consumerId:
 *                 type: string
 *                 description: Consumer ID
 *                 required: true
 *               grnItemId:
 *                 type: string
 *                 description: GRN Item ID (optional)
 *               poLineItemId:
 *                 type: string
 *                 description: Purchase Order Line Item ID (optional)
 *               expiredAt:
 *                 type: string
 *                 format: date-time
 *                 description: Expiration date (optional)
 *               supplierId:
 *                 type: string
 *                 description: Supplier ID (optional)
 *             required:
 *               - itemName
 *               - quantity
 *               - consumerId
 *     responses:
 *       201:
 *         description: Inventory item created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', createOrUpdateInventoryController);

export default router;

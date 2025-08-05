//location routes

import { Router } from "express";
import { getAllLocationsController, getLocationByIdController, createLocationController} from "../controllers/location.controller";

const router = Router();

/**
 * @swagger
 * /api/location:
 *   get:
 *     summary: Get all locations
 *     description: Retrieve a list of all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of locations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllLocationsController);

/**
 * @swagger
 * /api/location/{id}:
 *   get:
 *     summary: Get location by ID
 *     description: Retrieve a specific location by its ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the location
 *     responses:
 *       200:
 *         description: Location retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Bad request - location ID is required
 *       404:
 *         description: Location not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getLocationByIdController);

/**
 * @swagger
 * /api/location:
 *   post:
 *     summary: Create a new location
 *     description: Create a new location with the provided information
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLocationDto'
 *     responses:
 *       201:
 *         description: Location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post("/", createLocationController);

export default router;

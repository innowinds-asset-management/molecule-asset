//department routes
import { Router } from 'express';
import { getAllDepartmentsController, getDepartmentByIdController, createDepartmentController, getDepartmentsByConsumerIdController } from '../controllers/department.controller';

const router = Router();

/**
 * @swagger
 * /api/department:
 *   get:
 *     summary: Get all departments
 *     description: Retrieve a list of all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllDepartmentsController);

/**
 * @swagger
 * /api/department:
 *   post:
 *     summary: Create a new department
 *     description: Create a new department with the provided information
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentDto'
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', createDepartmentController);

/**
 * @swagger
 * /api/department/consumer/{consumerId}:
 *   get:
 *     summary: Get departments by consumer ID
 *     description: Retrieve all departments associated with a specific consumer
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: consumerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the consumer
 *     responses:
 *       200:
 *         description: List of departments for the consumer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       400:
 *         description: Bad request - consumer ID is required
 *       404:
 *         description: Consumer not found
 *       500:
 *         description: Internal server error
 */
router.get('/consumer/:consumerId', getDepartmentsByConsumerIdController);

/**
 * @swagger
 * /api/department/{deptId}:
 *   get:
 *     summary: Get department by ID
 *     description: Retrieve a specific department by its ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: deptId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       400:
 *         description: Bad request - department ID is required
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
router.get('/:deptId', getDepartmentByIdController);

export default router;

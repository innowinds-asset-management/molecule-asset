//department routes
import { Router } from 'express';
import { getAllDepartmentsController, getDepartmentByIdController, createDepartmentController, getDepartmentsByConsumerIdController, getDepartmentCountByConsumerIdController } from '../controllers/department.controller';

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
 * /api/department/consumer:
 *   get:
 *     summary: Get departments by consumer ID
 *     description: Retrieve all departments associated with the authenticated consumer
 *     tags: [Departments]
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
router.get('/consumer', getDepartmentsByConsumerIdController);

/**
 * @swagger
 * /api/department/count:
 *   get:
 *     summary: Get department count by consumer ID
 *     description: Retrieve the count of departments associated with the authenticated consumer
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Department count retrieved successfully
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
 *                     departmentCount:
 *                       type: number
 *       400:
 *         description: Bad request - consumer ID is required
 *       500:
 *         description: Internal server error
 */
router.get('/count', getDepartmentCountByConsumerIdController);

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

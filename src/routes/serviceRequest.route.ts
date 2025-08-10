//service request routes

import { Router } from 'express';
import { 
  getAllServiceRequestsController, 
  getServiceRequestByIdController, 
  createServiceRequestController, 
  updateServiceRequestController, 
  deleteServiceRequestController,
  getServiceRequestsByAssetIdController
} from '../controllers/serviceRequest.controller';

const router = Router();

/**
 * @swagger
 * /api/service-request:
 *   get:
 *     summary: Get all service requests
 *     description: Retrieve a list of all service requests with their related data
 *     tags: [Service Requests]
 *     responses:
 *       200:
 *         description: List of service requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiceRequest'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllServiceRequestsController);

/**
 * @swagger
 * /api/service-request/{id}:
 *   get:
 *     summary: Get service request by ID
 *     description: Retrieve a specific service request by its ID
 *     tags: [Service Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the service request
 *     responses:
 *       200:
 *         description: Service request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceRequest'
 *       400:
 *         description: Bad request - service request ID is required
 *       404:
 *         description: Service request not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getServiceRequestByIdController);

/**
 * @swagger
 * /api/service-request/asset/{assetId}:
 *   get:
 *     summary: Get service requests by asset ID
 *     description: Retrieve all service requests for a specific asset
 *     tags: [Service Requests]
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset
 *     responses:
 *       200:
 *         description: Service requests for asset retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiceRequest'
 *       400:
 *         description: Bad request - asset ID is required
 *       500:
 *         description: Internal server error
 */
router.get('/asset/:assetId', getServiceRequestsByAssetIdController);

/**
 * @swagger
 * /api/service-request:
 *   post:
 *     summary: Create a new service request
 *     description: Create a new service request with the provided information
 *     tags: [Service Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetId
 *               - technicianName
 *               - warrantyStatus
 *               - serviceDate
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset this service request belongs to
 *               technicianName:
 *                 type: string
 *                 description: Name of the technician
 *               serviceSupplierId:
 *                 type: string
 *                 nullable: true
 *                 description: Supplier ID providing the service
 *               serviceContractId:
 *                 type: string
 *                 nullable: true
 *                 description: Related service contract ID
 *               srNo:
 *                 type: string
 *                 nullable: true
 *                 description: Service Request number (auto if omitted)
 *               warrantyStatus:
 *                 type: string
 *                 enum: [ACTIVE, EXPIRED, VOID, CLAIMED, PENDING_CLAIM, TRANSFERRED, SUSPENDED, NOT_APPLICABLE]
 *                 description: Status of the warranty
 *               serviceStatus:
 *                 type: string
 *                 description: Status of the service
 *               serviceDate:
 *                 type: string
 *                 format: date
 *                 description: Date of the service
 *               serviceType:
 *                 type: string
 *                 description: Type of service (Preventive, Repair, Installation)
 *               serviceDescription:
 *                 type: string
 *                 description: Description of the service
 *               approverName:
 *                 type: string
 *                 description: Name of the approver
 *     responses:
 *       201:
 *         description: Service request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceRequest'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', createServiceRequestController);

/**
 * @swagger
 * /api/service-request/{id}:
 *   put:
 *     summary: Update a service request
 *     description: Update an existing service request with the provided information
 *     tags: [Service Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the service request to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset this service request belongs to
 *               technicianName:
 *                 type: string
 *                 description: Name of the technician
 *               serviceSupplierId:
 *                 type: string
 *                 nullable: true
 *                 description: Supplier ID providing the service
 *               serviceContractId:
 *                 type: string
 *                 nullable: true
 *                 description: Related service contract ID
 *               srNo:
 *                 type: string
 *                 nullable: true
 *                 description: Service Request number (auto if omitted)
 *               warrantyStatus:
 *                 type: string
 *                 enum: [ACTIVE, EXPIRED, VOID, CLAIMED, PENDING_CLAIM, TRANSFERRED, SUSPENDED, NOT_APPLICABLE]
 *                 description: Status of the warranty
 *               serviceStatus:
 *                 type: string
 *                 description: Status of the service
 *               serviceDate:
 *                 type: string
 *                 format: date
 *                 description: Date of the service
 *               serviceType:
 *                 type: string
 *                 description: Type of service (Preventive, Repair, Installation)
 *               serviceDescription:
 *                 type: string
 *                 description: Description of the service
 *               approverName:
 *                 type: string
 *                 description: Name of the approver
 *     responses:
 *       200:
 *         description: Service request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceRequest'
 *       400:
 *         description: Bad request - invalid input data
 *       404:
 *         description: Service request not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateServiceRequestController);

/**
 * @swagger
 * /api/service-request/{id}:
 *   delete:
 *     summary: Delete a service request
 *     description: Delete a service request by its ID
 *     tags: [Service Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service request to delete
 *     responses:
 *       200:
 *         description: Service request deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceRequest'
 *       400:
 *         description: Bad request - service request ID is required
 *       404:
 *         description: Service request not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteServiceRequestController);

export default router;

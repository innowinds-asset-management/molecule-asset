//service request routes

import { Router } from 'express';
import { 
  getAllServiceRequestsController, 
  getServiceRequestByIdController, 
  createServiceRequestController, 
  createServiceRequestWithItemsController,
  createServiceRequestItemController,
  createServiceRequestItemsController,
  updateServiceRequestController, 
  updateServiceRequestItemController,
  deleteServiceRequestController,
  deleteServiceRequestItemController,
  getServiceRequestsByAssetIdController,
  getServiceRequestCountsByStatusController
} from '../controllers/serviceRequest.controller';

const router = Router();

/**
 * @swagger
 * /api/service-request:
 *   get:
 *     summary: Get all service requests
 *     description: Retrieve a list of all service requests with their related data, optionally filtered by status
 *     tags: [Service Requests]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter service requests by status code
 *       - in: query
 *         name: sid
 *         schema:
 *           type: string
 *         description: Filter service requests by supplier ID
 *       - in: query
 *         name: did
 *         schema:
 *           type: string
 *         description: Filter service requests by department ID
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
 * /api/service-request/count/status:
 *   get:
 *     summary: Get service request counts by status
 *     description: Retrieve counts of service requests grouped by status codes (CANCELLED, CLOSED, COMPLETED, OPEN, INPROGRESS, PENDING)
 *     tags: [Service Requests]
 *     responses:
 *       200:
 *         description: Service request counts retrieved successfully
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
 *                     cancelled:
 *                       type: number
 *                       description: Count of cancelled service requests
 *                     closed:
 *                       type: number
 *                       description: Count of closed service requests
 *                     completed:
 *                       type: number
 *                       description: Count of completed service requests
 *                     open:
 *                       type: number
 *                       description: Count of open service requests
 *                     inProgress:
 *                       type: number
 *                       description: Count of in-progress service requests
 *                     pending:
 *                       type: number
 *                       description: Count of pending service requests
 *                     total:
 *                       type: number
 *                       description: Total count of all service requests
 *       500:
 *         description: Internal server error
 */
router.get('/count/status', getServiceRequestCountsByStatusController);

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
 *     description: Create a new service request with minimal required information
 *     tags: [Service Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetId
 *               - problem
 *               - assetCondition
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset this service request belongs to
 *               problem:
 *                 type: string
 *                 description: Problem description in text form
 *               assetCondition:
 *                 type: string
 *                 description: Current condition of the asset (Working, Not Working, Working with Conditions, etc.)
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
 * /api/service-request/with-items:
 *   post:
 *     summary: Create a new service request with items
 *     description: Create a new service request with items included
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
 *               assetCondition:
 *                 type: string
 *                 description: Current condition of the asset (Working, Not Working, Working with Conditions, etc.)
 *               problem:
 *                 type: string
 *                 description: Problem description in text form
 *               approverName:
 *                 type: string
 *                 description: Name of the approver
 *               serviceRequestItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     partName:
 *                       type: string
 *                       description: Name of the part
 *                     partCost:
 *                       type: number
 *                       description: Cost of the part
 *                     labourCost:
 *                       type: number
 *                       description: Labour cost
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of parts
 *                     totalCost:
 *                       type: number
 *                       description: Total cost for this item
 *                     defectDescription:
 *                       type: string
 *                       description: Description of the defect
 *     responses:
 *       201:
 *         description: Service request with items created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceRequest'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/with-items', createServiceRequestWithItemsController);

/**
 * @swagger
 * /api/service-request/{serviceRequestId}/items:
 *   post:
 *     summary: Add a single item to a service request
 *     description: Add a single service request item to an existing service request
 *     tags: [Service Requests]
 *     parameters:
 *       - in: path
 *         name: serviceRequestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the service request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - partName
 *             properties:
 *               partName:
 *                 type: string
 *                 description: Name of the part
 *               partCost:
 *                 type: number
 *                 description: Cost of the part
 *               labourCost:
 *                 type: number
 *                 description: Labour cost
 *               quantity:
 *                 type: integer
 *                 description: Quantity of parts
 *               totalCost:
 *                 type: number
 *                 description: Total cost for this item
 *               defectDescription:
 *                 type: string
 *                 description: Description of the defect
 *     responses:
 *       201:
 *         description: Service request item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceRequestItem'
 *       400:
 *         description: Bad request - service request ID is required
 *       500:
 *         description: Internal server error
 */
router.post('/:serviceRequestId/item', createServiceRequestItemController);

/**
 * @swagger
 * /api/service-request/{serviceRequestId}/items/bulk:
 *   post:
 *     summary: Add multiple items to a service request
 *     description: Add multiple service request items to an existing service request
 *     tags: [Service Requests]
 *     parameters:
 *       - in: path
 *         name: serviceRequestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the service request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - partName
 *                   properties:
 *                     partName:
 *                       type: string
 *                       description: Name of the part
 *                     partCost:
 *                       type: number
 *                       description: Cost of the part
 *                     labourCost:
 *                       type: number
 *                       description: Labour cost
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of parts
 *                     totalCost:
 *                       type: number
 *                       description: Total cost for this item
 *                     defectDescription:
 *                       type: string
 *                       description: Description of the defect
 *     responses:
 *       201:
 *         description: Service request items created successfully
 *       400:
 *         description: Bad request - service request ID is required or items must be an array
 *       500:
 *         description: Internal server error
 */
router.post('/:serviceRequestId/items/bulk', createServiceRequestItemsController);

/**
 * @swagger
 * /api/service-request/item/{serviceRequestItemId}:
 *   put:
 *     summary: Update a service request item
 *     description: Update an existing service request item with the provided information
 *     tags: [Service Requests]
 *     parameters:
 *       - in: path
 *         name: serviceRequestItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the service request item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partName:
 *                 type: string
 *                 description: Name of the part
 *               partCost:
 *                 type: number
 *                 description: Cost of the part
 *               labourCost:
 *                 type: number
 *                 description: Labour cost
 *               quantity:
 *                 type: integer
 *                 description: Quantity of parts
 *               totalCost:
 *                 type: number
 *                 description: Total cost for this item
 *               defectDescription:
 *                 type: string
 *                 description: Description of the defect
 *     responses:
 *       200:
 *         description: Service request item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceRequestItem'
 *       400:
 *         description: Bad request - service request item ID is required
 *       404:
 *         description: Service request item not found
 *       500:
 *         description: Internal server error
 */
router.put('/item/:serviceRequestItemId', updateServiceRequestItemController);

/**
 * @swagger
 * /api/service-request/item/{serviceRequestItemId}:
 *   delete:
 *     summary: Delete a service request item
 *     description: Delete a service request item by its ID
 *     tags: [Service Requests]
 *     parameters:
 *       - in: path
 *         name: serviceRequestItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the service request item to delete
 *     responses:
 *       200:
 *         description: Service request item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceRequestItem'
 *       400:
 *         description: Bad request - service request item ID is required
 *       404:
 *         description: Service request item not found
 *       500:
 *         description: Internal server error
 */
router.delete('/item/:serviceRequestItemId', deleteServiceRequestItemController);

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
 *               assetCondition:
 *                 type: string
 *                 description: Current condition of the asset (Working, Not Working, Working with Conditions, etc.)
 *               problem:
 *                 type: string
 *                 description: Problem description in text form
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

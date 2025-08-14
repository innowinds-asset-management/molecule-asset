//service request controllers

import { Request, Response } from 'express';
import { 
  getAllServiceRequests, 
  getServiceRequestById, 
  createServiceRequest, 
  createServiceRequestWithItems,
  createServiceRequestItem,
  createServiceRequestItems,
  updateServiceRequest, 
  updateServiceRequestItem,
  deleteServiceRequest,
  deleteServiceRequestItem,
  getServiceRequestsByAssetId
} from '../services/serviceRequest.service';

// Service Request Controllers
export const getAllServiceRequestsController = async (req: Request, res: Response) => {
  try {
    const { status, sid, did } = req.query; // Added did for departmentId
    const serviceRequests = await getAllServiceRequests(status as string, sid as string, did as string); // Passed did
    return res.json(serviceRequests);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch service requests' });
  }
};

export const getServiceRequestByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Service Request ID is required' });
    }
    const serviceRequest = await getServiceRequestById(id);
    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service Request not found' });
    }
    return res.json(serviceRequest);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch service request' });
  }
};

export const getServiceRequestsByAssetIdController = async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    if (!assetId) {
      return res.status(400).json({ error: 'Asset ID is required' });
    }
    const serviceRequests = await getServiceRequestsByAssetId(assetId);
    return res.json(serviceRequests);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch service requests for asset' });
  }
};

export const createServiceRequestController = async (req: Request, res: Response) => {
  try {
    const serviceRequest = req.body;
    const newServiceRequest = await createServiceRequest(serviceRequest);
    return res.status(201).json(newServiceRequest);
  } catch (error: any) {
    console.error('Controller error:', error);
    
    // Handle validation errors (400)
    if (error.message && !error.code) {
      return res.status(400).json({ 
        error: error.message,
        type: 'validation_error'
      });
    }
    
    // Handle Prisma errors (400 for constraint violations, 500 for others)
    if (error.code) {
      if (['P2002', 'P2003', 'P2014'].includes(error.code)) {
        return res.status(400).json({ 
          error: error.message || 'Invalid data provided',
          type: 'constraint_error'
        });
      }
    }
    
    // Default error response
    return res.status(500).json({ 
      error: 'Failed to create service request. Please try again later.',
      type: 'server_error'
    });
  }
};

export const createServiceRequestWithItemsController = async (req: Request, res: Response) => {
  try {
    const serviceRequest = req.body;
    const newServiceRequest = await createServiceRequestWithItems(serviceRequest);
    return res.status(201).json(newServiceRequest);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create service request with items' });
  }
};

export const createServiceRequestItemController = async (req: Request, res: Response) => {
  try {
    const { serviceRequestId } = req.params;
    const item = req.body;
    
    if (!serviceRequestId) {
      return res.status(400).json({ error: 'Service Request ID is required' });
    }
    
    const newItem = await createServiceRequestItem(serviceRequestId, item);
    return res.status(201).json(newItem);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create service request item' });
  }
};

export const createServiceRequestItemsController = async (req: Request, res: Response) => {
  try {
    const { serviceRequestId } = req.params;
    const { items } = req.body;
    
    if (!serviceRequestId) {
      return res.status(400).json({ error: 'Service Request ID is required' });
    }
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }
    
    const result = await createServiceRequestItems(serviceRequestId, items);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create service request items' });
  }
};

export const updateServiceRequestController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Service Request ID is required' });
    }
    const serviceRequest = req.body;
    const updatedServiceRequest = await updateServiceRequest(id, serviceRequest);
    return res.json(updatedServiceRequest);
  } catch (error) {
    console.log('error======>',error)
    return res.status(500).json({ error: 'Failed to update service request' });
  }
};

export const updateServiceRequestItemController = async (req: Request, res: Response) => {
  try {
    const { serviceRequestItemId } = req.params;
    const item = req.body;
    
    if (!serviceRequestItemId) {
      return res.status(400).json({ error: 'Service Request Item ID is required' });
    }
    
    const updatedItem = await updateServiceRequestItem(serviceRequestItemId, item);
    return res.json(updatedItem);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update service request item' });
  }
};

export const deleteServiceRequestController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {    
      return res.status(400).json({ error: 'Service Request ID is required' });
    }
    const deletedServiceRequest = await deleteServiceRequest(id);
    return res.json(deletedServiceRequest);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete service request' });
  }
};

export const deleteServiceRequestItemController = async (req: Request, res: Response) => {
  try {
    const { serviceRequestItemId } = req.params;
    if (!serviceRequestItemId) {
      return res.status(400).json({ error: 'Service Request Item ID is required' });
    }
    const deletedItem = await deleteServiceRequestItem(serviceRequestItemId);
    return res.json(deletedItem);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete service request item' });
  }
};

//service request controllers

import { Request, Response } from 'express';
import { 
  getAllServiceRequests, 
  getServiceRequestById, 
  createServiceRequest, 
  updateServiceRequest, 
  deleteServiceRequest,
  getServiceRequestsByAssetId
} from '../services/serviceRequest.service';

// Service Request Controllers
export const getAllServiceRequestsController = async (_req: Request, res: Response) => {
  try {
    const serviceRequests = await getAllServiceRequests();
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
    const serviceRequest = await getServiceRequestById(parseInt(id));
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
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create service request' });
  }
};

export const updateServiceRequestController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Service Request ID is required' });
    }
    const serviceRequest = req.body;
    const updatedServiceRequest = await updateServiceRequest(parseInt(id), serviceRequest);
    return res.json(updatedServiceRequest);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update service request' });
  }
};

export const deleteServiceRequestController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {    
      return res.status(400).json({ error: 'Service Request ID is required' });
    }
    const deletedServiceRequest = await deleteServiceRequest(parseInt(id));
    return res.json(deletedServiceRequest);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete service request' });
  }
};

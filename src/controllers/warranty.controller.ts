//warranty controllers
import { FILTER_TYPES } from '../utils/constants';
import { NextFunction, Request, Response } from 'express';

 
import { 
  getAllWarranties,
  getWarrantyById, 
  createWarranty, 
  updateWarranty, 
  deleteWarranty,
  getWarrantiesByAssetId,
  getAllWarrantyTypes,
  getWarrantyTypeById,
  createWarrantyType,
  updateWarrantyType,
  deleteWarrantyType,
  getWarrantyStats,
  getWarrantiesWithoutAmcCMc 
} from '../services/warranty.service';
import { validateQueryParams } from '../helper/helper';
import { AssetRequest } from '../middleware/userContextMiddleware';
import ResponseHandler from '../helper/responseHandler';

// Warranty Controllers
export const getAllWarrantiesController = async (req: AssetRequest, res: Response,next: NextFunction) => {
  try {
    validateQueryParams(req.query, ['sid', 'filterType', 'filterDays']);    
    let msg = 'Warranties fetched successfully';
    const consumerId =  req._u?.consumerId;    
    if (!consumerId) {
      throw new Error("Invalid consumer ID");
    }
    
    // Extract filter parameters from query
    const { filterType, filterDays } = req.query;
    
    // Validate filter parameters
    if (filterType && ![FILTER_TYPES.expiring, FILTER_TYPES.expired].includes(filterType as typeof FILTER_TYPES.expiring | typeof FILTER_TYPES.expired)) {
      return next(new Error('Invalid filterType. Must be "expiring" or "expired"'));
    }
    
    if (filterDays && (isNaN(Number(filterDays)) || Number(filterDays) < 1 || Number(filterDays) > 365)) {
      return next(new Error('Invalid filterDays. Must be a number between 1 and 365'));
    }
    
    // Convert filter parameters to the format expected by the service
    const filter = filterType && filterDays ? {
      type: filterType as typeof FILTER_TYPES.expiring | typeof FILTER_TYPES.expired,
      days: Number(filterDays)
    } : undefined;
    
    // Use getAllWarranties with filtering
    const warranties = await getAllWarranties(consumerId, filter);
    if(warranties.length === 0){
      msg = 'No warranties found';
    }
    return ResponseHandler.success(res, msg, warranties);
  } catch (error) {
    console.log('error warranty controller=======>',error)
    return next(error);
  }
};

export const getWarrantyByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Warranty ID is required' });
    }
    const warranty = await getWarrantyById(parseInt(id));
    if (!warranty) {
      return res.status(404).json({ error: 'Warranty not found' });
    }
    return res.json(warranty);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch warranty' });
  }
};

export const getWarrantiesByAssetIdController = async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    if (!assetId) {
      return res.status(400).json({ error: 'Asset ID is required' });
    }
    const warranties = await getWarrantiesByAssetId(assetId);
    return res.json(warranties);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch warranties for asset' });
  }
};

export const createWarrantyController = async (req: Request, res: Response) => {
  try {
    const warranty = req.body;
    const newWarranty = await createWarranty(warranty);
    return res.status(201).json(newWarranty);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create warranty' });
  }
};

export const updateWarrantyController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Warranty ID is required' });
    }
    const warranty = req.body;
    const updatedWarranty = await updateWarranty(parseInt(id), warranty);
    return res.json(updatedWarranty);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update warranty' });
  }
};

export const deleteWarrantyController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {    
      return res.status(400).json({ error: 'Warranty ID is required' });
    }
    const deletedWarranty = await deleteWarranty(parseInt(id));
    return res.json(deletedWarranty);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete warranty' });
  }
};

// Warranty Type Controllers
export const getAllWarrantyTypesController = async (req: AssetRequest, res: Response) => {
  try {
    validateQueryParams(req.query, ['sid']);

    const supplierId = req.query['sid'] as string | undefined;
    const consumerId = req._u?.consumerId;

    const warrantyTypes = await getAllWarrantyTypes(supplierId, consumerId);
    return res.json(warrantyTypes);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch warranty types' });
  }
};


export const getWarrantyTypeByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Warranty Type ID is required' });
    }
    const warrantyType = await getWarrantyTypeById(parseInt(id));
    if (!warrantyType) {
      return res.status(404).json({ error: 'Warranty Type not found' });
    }
    return res.json(warrantyType);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch warranty type' });
  }
};

export const createWarrantyTypeController = async (req: Request, res: Response) => {
  try {
    const warrantyType = req.body;
    const newWarrantyType = await createWarrantyType(warrantyType);
    return res.status(201).json(newWarrantyType);
  } catch (error) {
    console.log('error=======>',error)
    return res.status(500).json({ error: 'Failed to create warranty type' });
  }
};

export const updateWarrantyTypeController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Warranty Type ID is required' });
    }
    const warrantyType = req.body;
    const updatedWarrantyType = await updateWarrantyType(parseInt(id), warrantyType);
    return res.json(updatedWarrantyType);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update warranty type' });
  }
};

export const deleteWarrantyTypeController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {    
      return res.status(400).json({ error: 'Warranty Type ID is required' });
    }
    const deletedWarrantyType = await deleteWarrantyType(parseInt(id));
    return res.json(deletedWarrantyType);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete warranty type' });
  }
};

//get warranty stats
export const getWarrantyStatsController = async (req: AssetRequest, res: Response, next: NextFunction) => {
  try {
    const consumerId = req._u?.consumerId;    
    if (!consumerId) {
      return next(new Error('Consumer ID is required'));
    }    
    const warrantyStats = await getWarrantyStats(consumerId);
    return ResponseHandler.success(res, 'Warranty stats fetched successfully', warrantyStats);
  } catch (error) {
    return next(error);
  }
};

//get all warranties without AMC/CMC
export const getAllWarrantiesWithoutAmcCmcController = async (req: AssetRequest, res: Response, next: NextFunction) => {
  try {
    const consumerId = req._u?.consumerId;    
    if (!consumerId) {
      return next(new Error('Consumer ID is required'));
    }
    const warranties = await getWarrantiesWithoutAmcCMc(consumerId);
    return ResponseHandler.success(res, 'Warranties fetched successfully', warranties);
  } catch (error) {
    return next(error);
  }
};

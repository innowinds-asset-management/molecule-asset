//warranty controllers

import { Request, Response } from 'express';
 
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
  getWarrantyStats
} from '../services/warranty.service';
import { validateQueryParams } from '../helper/helper';
import { AssetRequest } from '../middleware/userContextMiddleware';
//import ResponseHandler from '../helper/responseHandler';

// Warranty Controllers
export const getAllWarrantiesController = async (req: AssetRequest, res: Response) => {
  try {
    validateQueryParams(req.query, ['sid']);
      
    
    const consumerId =  req._u?.consumerId;
    
    // if (1==1) {
    //   throw new Error("Invalid consumer ID");
    // }    
    const warranties = await getAllWarranties(consumerId);
    return res.json(warranties);
    //return ResponseHandler.success(res, 'Warranties fetched successfully', warranties);
  } catch (error) {
    console.log('error warranty controller=======>',error)
    return res.status(500).json({ error: 'Failed to fetch warranties' });
    //return ResponseHandler.error(res,'Failed to fetch warranties',error as string);
    //return next(error);
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
export const getWarrantyStatsController = async (req: AssetRequest, res: Response) => {
  try {
    const consumerId = req._u?.consumerId;
    
    if (!consumerId) {
      return res.status(400).json({ error: 'Consumer ID is required' });
    }
    
    const warrantyStats = await getWarrantyStats(consumerId);
    return res.json(warrantyStats);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch warranty stats' });
  }
};
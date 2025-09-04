import { Request, Response } from 'express';
import {
  createSupplierAndLinkToConsumer,
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
  getConsumersForSupplier,
  linkConsumerToSupplier,
  unlinkConsumerFromSupplier,
  updateSupplier,
  listSuppliersOfConsumerWithStats,
  getSupplierDetailsById,
  searchSuppliersByConsumer,
  createDefaultSupplierSignUp
} from '../services/supplier.service';
import { AssetRequest } from '../middleware/userContextMiddleware';

export const listSuppliersController = async (_req: Request, res: Response) => {
  try {
    const rows = await getAllSuppliers();
    return res.json(rows);
  } catch (error) {
    console.error('Error in listSuppliersController:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch suppliers'
    });
  }
};

export const getSupplierByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const row = await getSupplierById(id);
    if (!row) return res.status(404).json({ error: 'Supplier not found' });
    return res.json(row);
  } catch (error) {
    console.error('Error in getSupplierByIdController:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch supplier'
    });
  }
};

export const createSupplierController = async (req: AssetRequest, res: Response) => {
  try {
    console.log('inside=========>')
    const consumerId = req._u?.consumerId;
    if (!consumerId) {
      return res.status(400).json({ error: 'Consumer ID is required' });
    }
    
    const result = await createSupplierAndLinkToConsumer(req.body, consumerId);
    return res.status(201).json(result.supplier);
  } catch (error) {
    console.error('Error in createSupplierController:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create supplier'
    });
  }
};

export const updateSupplierController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const row = await updateSupplier(id, req.body);
    return res.json(row);
  } catch (error) {
    console.error('Error in updateSupplierController:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to update supplier'
    });
  }
};

export const deleteSupplierController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const row = await deleteSupplier(id);
    return res.json(row);
  } catch (error) {
    console.error('Error in deleteSupplierController:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to delete supplier'
    });
  }
};

export const listConsumersForSupplierController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const rows = await getConsumersForSupplier(id);
    return res.json(rows);
  } catch (error) {
    console.error('Error in listConsumersForSupplierController:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch consumers for supplier'
    });
  }
};

export const linkConsumerToSupplierController = async (req: AssetRequest, res: Response) => {
  try {
    const { id } = req.params;
    const consumerId = req._u?.consumerId;
    if (!id || !consumerId) return res.status(400).json({ error: 'id and consumerId are required' });
    const row = await linkConsumerToSupplier(id, consumerId);
    return res.status(201).json(row);
  } catch (error) {
    console.error('Error in linkConsumerToSupplierController:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to link consumer to supplier'
    });
  }
};

export const unlinkConsumerFromSupplierController = async (req: AssetRequest, res: Response) => {
  try {
    const { id } = req.params;
    const consumerId = req._u?.consumerId;
    if (!id || !consumerId) return res.status(400).json({ error: 'id and consumerId are required' });
    const row = await unlinkConsumerFromSupplier(id, consumerId);
    return res.json(row);
  } catch (error) {
    console.error('Error in unlinkConsumerFromSupplierController:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to unlink consumer from supplier'
    });
  }
};

// Search suppliers by consumer
export const searchSuppliersController = async (req: AssetRequest, res: Response) => {
  try {
    const { name } = req.query;
    const consumerId = req._u?.consumerId;

    if (!name || !consumerId) {
      return res.status(400).json({ 
        error: 'Search term and Consumer ID are required' 
      });
    }
    
    const searchTerm = name as string;
    
    if (searchTerm.length < 1) {
      return res.status(400).json({ 
        error: 'Search term must be at least 1 character long' 
      });
    }

    const results = await searchSuppliersByConsumer(searchTerm, consumerId);
    return res.json(results);
  } catch (error) {
    console.error('Error searching suppliers:', error);
    return res.status(500).json({ 
      error: 'Failed to search suppliers' 
    });
  }
};

// Get suppliers of a consumer with asset counts and open service request counts
export const listSuppliersOfConsumerWithStatsController = async (req: AssetRequest, res: Response) => {
  try {
    const consumerId = req._u?.consumerId;
    
    if (!consumerId) {
      return res.status(400).json({ error: 'consumerId is required' });
    }
    
    const suppliers = await listSuppliersOfConsumerWithStats(consumerId);
    return res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers with stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get supplier details by ID with asset counts and open service request counts
export const getSupplierDetailsByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id is required' });
    
    const supplier = await getSupplierDetailsById(id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    
    return res.json(supplier);
  } catch (error) {
    console.error('Error fetching supplier details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Create default supplier at the time of sign up
export const createDefaultSupplierSignUpController = async (req: Request, res: Response) => {
  try {
    const result = await createDefaultSupplierSignUp(req.body.id);
    return res.status(201).json(result.supplier);
  } catch (error) {
    console.error('Error in createDefaultSupplierSignUpController:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create default supplier'
    });
  }
};



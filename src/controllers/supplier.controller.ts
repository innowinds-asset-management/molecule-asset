import { Request, Response } from 'express';
import {
  createSupplier,
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
} from '../services/supplier.service';

export const listSuppliersController = async (_req: Request, res: Response) => {
  const rows = await getAllSuppliers();
  return res.json(rows);
};

export const getSupplierByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'id is required' });
  const row = await getSupplierById(id);
  if (!row) return res.status(404).json({ error: 'Supplier not found' });
  return res.json(row);
};

export const createSupplierController = async (req: Request, res: Response) => {
  const row = await createSupplier(req.body);
  return res.status(201).json(row);
};

export const updateSupplierController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'id is required' });
  const row = await updateSupplier(id, req.body);
  return res.json(row);
};

export const deleteSupplierController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'id is required' });
  const row = await deleteSupplier(id);
  return res.json(row);
};

export const listConsumersForSupplierController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'id is required' });
  const rows = await getConsumersForSupplier(id);
  return res.json(rows);
};

export const linkConsumerToSupplierController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { consumerId } = req.body as { consumerId?: string };
  if (!id || !consumerId) return res.status(400).json({ error: 'id and consumerId are required' });
  const row = await linkConsumerToSupplier(id, consumerId);
  return res.status(201).json(row);
};

export const unlinkConsumerFromSupplierController = async (req: Request, res: Response) => {
  const { id, consumerId } = req.params as { id?: string; consumerId?: string };
  if (!id || !consumerId) return res.status(400).json({ error: 'id and consumerId are required' });
  const row = await unlinkConsumerFromSupplier(id, consumerId);
  return res.json(row);
};

// Search suppliers by consumer
export const searchSuppliersController = async (req: Request, res: Response) => {
  try {
    const { search, cid } = req.query;

    if (!search || !cid) {
      return res.status(400).json({ 
        error: 'Search term and Consumer ID are required' 
      });
    }

    const searchTerm = search as string;
    const consumerId = cid as string;

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
export const listSuppliersOfConsumerWithStatsController = async (req: Request, res: Response) => {
  try {
    const { cid } = req.query;
    
    if (!cid || typeof cid !== 'string') {
      return res.status(400).json({ error: 'consumerId is required as a query parameter' });
    }
    
    const suppliers = await listSuppliersOfConsumerWithStats(cid);
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

//fetch all suppliers


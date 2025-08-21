import { Request, Response } from 'express';
import { getAllInventoryTransactionTypes } from '../services/inventoryTransactionType.service';

export const getAllInventoryTransactionTypesController = async (_req: Request, res: Response) => {
  try {
    const transactionTypes = await getAllInventoryTransactionTypes();
    return res.json(transactionTypes);
  } catch (error) {
    console.error('Error fetching inventory transaction types:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch inventory transaction types' 
    });
  }
};

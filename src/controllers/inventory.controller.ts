//fetch all inventory items

import { Request, Response } from 'express';
import { getAllInventory, getInventoryById, createOrUpdateInventory, searchInventoryItems, transferInventory } from '../services/inventory.service';
import { INVENTORY_TRANSACTION_TYPE_CODES } from '../utils/constants';

export const getAllInventoryController = async (req: Request, res: Response) => {
  const { cid } = req.query;

  if (!cid) {
    return res.status(400).json({ error: 'Consumer ID is required' });
  }

  const inventory = await getAllInventory(cid as string);
  return res.json(inventory);
};

// Search inventory items
export const searchInventoryController = async (req: Request, res: Response) => {
  try {
    const { search, cid } = req.query;

    if (!search || !cid) {
      return res.status(400).json({ 
        error: 'Search term and Consumer ID are required' 
      });
    }

    const searchTerm = search as string;
    const consumerId = cid as string;

    const results = await searchInventoryItems(searchTerm, consumerId);
    return res.json(results);
  } catch (error) {
    console.error('Error searching inventory:', error);
    return res.status(500).json({ 
      error: 'Failed to search inventory items' 
    });
  }
};

//fetch inventory by id 
export const getInventoryByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const inventory = await getInventoryById(id);
  return res.json(inventory);
};

// Create or update inventory item
export const createOrUpdateInventoryController = async (req: Request, res: Response) => {
  try {
    const { 
      itemId, 
      itemName, 
      quantity, 
      unitMeasure, 
      consumerId,
      grnItemId,
      poLineItemId,
      expiredAt,
      supplierId
    } = req.body;

    // Validate required fields
    if (!itemName || !quantity || !consumerId) {
      return res.status(400).json({ 
        error: 'itemName, quantity, and consumerId are required' 
      });
    }

    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({ 
        error: 'quantity must be greater than 0' 
      });
    }

    const inventoryData: any = {
      itemId,
      itemName,
      quantity,
      unitMeasure,
      consumerId,
      grnItemId,
      poLineItemId,
      supplierId
    };

    if (expiredAt) {
      inventoryData.expiredAt = new Date(expiredAt);
    }

    const inventory = await createOrUpdateInventory(inventoryData);

    return res.status(201).json({
      message: itemId ? 'Inventory updated successfully' : 'Inventory created successfully',
      data: inventory
    });
  } catch (error) {
    console.error('Error creating/updating inventory:', error);
    return res.status(500).json({ 
      error: 'Failed to create/update inventory item' 
    });
  }
};

export const transferInventoryController = async (req: Request, res: Response) => {
  try {
    const {
      inventoryId,
      quantity,
      transactionTypeCode,
      departmentId,
      supplierId,
      grnItemId,
      poLineItemId,
      expiredAt,
      reason
    } = req.body;

    // Validate required fields
    if (!inventoryId || !quantity || !transactionTypeCode) {
      return res.status(400).json({
        success: false,
        message: 'inventoryId, quantity, and transactionTypeCode are required'
      });
    }

    // Validate transaction type
    if (!INVENTORY_TRANSACTION_TYPE_CODES.includes(transactionTypeCode)) {
      return res.status(400).json({
        success: false,
        message: `transactionTypeCode must be one of: ${INVENTORY_TRANSACTION_TYPE_CODES.join(', ')}`
      });
    }

    // Validate quantity
    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'quantity must be greater than 0'
      });
    }

    // Convert expiredAt to Date if provided
    let expiredAtDate: Date | undefined;
    if (expiredAt) {
      expiredAtDate = new Date(expiredAt);
      if (isNaN(expiredAtDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expiredAt date format'
        });
      }
    }

    const transferData: any = {
      inventoryId,
      quantity,
      transactionTypeCode,
      departmentId,
      supplierId,
      grnItemId,
      poLineItemId,
      reason
    };

    if (expiredAtDate) {
      transferData.expiredAt = expiredAtDate;
    }

    const result = await transferInventory(transferData);

    return res.status(200).json({
      success: true,
      message: 'Inventory transfer completed successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Error in transferInventoryController:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};


//purchase order line item controller

import { Request, Response } from 'express';
import { getAllPurchaseOrderLineItems, getPurchaseOrderLineItemById, createPurchaseOrderLineItem, updatePurchaseOrderLineItem, deletePurchaseOrderLineItem } from '../services/poLineItem.service';

export const getAllPurchaseOrderLineItemsController = async (_req: Request, res: Response) => {
  const purchaseOrderLineItems = await getAllPurchaseOrderLineItems();
  return res.json(purchaseOrderLineItems);
};

//get purchase order line item by id
export const getPurchaseOrderLineItemByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const purchaseOrderLineItem = await getPurchaseOrderLineItemById(id);
  return res.json(purchaseOrderLineItem);
};

//create purchase order line item
export const createPurchaseOrderLineItemController = async (req: Request, res: Response) => {
  const purchaseOrderLineItem = req.body;
  const newPurchaseOrderLineItem = await createPurchaseOrderLineItem(purchaseOrderLineItem);
  return res.json(newPurchaseOrderLineItem);
};

//update purchase order line item
export const updatePurchaseOrderLineItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const purchaseOrderLineItem = req.body;
  const updatedPurchaseOrderLineItem = await updatePurchaseOrderLineItem(id, purchaseOrderLineItem);
  return res.json(updatedPurchaseOrderLineItem);
};

//delete purchase order line item   
export const deletePurchaseOrderLineItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const deletedPurchaseOrderLineItem = await deletePurchaseOrderLineItem(id);
  return res.json(deletedPurchaseOrderLineItem);
};

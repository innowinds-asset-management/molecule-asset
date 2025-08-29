//fetch all purchase orders

import { Request, Response } from 'express';
import { getAllPurchaseOrders, getPurchaseOrderById, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from '../services/po.service';

export const getAllPurchaseOrdersController = async (_req: Request, res: Response) => {
  console.log('inside=====>');
  const purchaseOrders = await getAllPurchaseOrders();
  return res.json(purchaseOrders);
};

//fetch purchase order by id
export const getPurchaseOrderByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const purchaseOrder = await getPurchaseOrderById(id);
  return res.json(purchaseOrder);
};

//create purchase order
export const createPurchaseOrderController = async (req: Request, res: Response) => {
  const purchaseOrder = req.body;
  const newPurchaseOrder = await createPurchaseOrder(purchaseOrder);
  return res.json(newPurchaseOrder);
};

//update purchase order
export const updatePurchaseOrderController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const purchaseOrder = req.body;
  const updatedPurchaseOrder = await updatePurchaseOrder(id, purchaseOrder);
  return res.json(updatedPurchaseOrder);
};

//delete purchase order
export const deletePurchaseOrderController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const deletedPurchaseOrder = await deletePurchaseOrder(id);
  return res.json(deletedPurchaseOrder);
};  

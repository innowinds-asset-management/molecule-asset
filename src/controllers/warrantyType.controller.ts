//warranty type controller

import { Request, Response } from 'express';
import { getAllWarrantyTypes, getWarrantyTypeById, getWarrantyTypesByConsumerId, getWarrantyTypesBySupplierId } from '../services/warrantyType.services';
import { AssetRequest } from '../middleware/userContextMiddleware';

//get all warranty types
export const getAllWarrantyTypesController = async (_req: Request, res: Response) => {
  const warrantyTypes = await getAllWarrantyTypes();
  res.json(warrantyTypes);
};

//get warranty type by id   
export const getWarrantyTypeByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const warrantyType = await getWarrantyTypeById(Number(id));
  res.json(warrantyType);
};

//get warranty types by consumer id
export const getWarrantyTypesByConsumerIdController = async (req: AssetRequest, res: Response) => {
  const consumerId = req._u?.consumerId;
  if (!consumerId) {
    return res.status(400).json({ error: 'Consumer ID is required' });
  }
  const warrantyTypes = await getWarrantyTypesByConsumerId(consumerId);
  return res.json(warrantyTypes);
};

//get warranty types by supplier id
export const getWarrantyTypesBySupplierIdController = async (req: Request, res: Response) => {
  const { supplierId } = req.params;
  if (!supplierId) {
    return res.status(400).json({ error: 'Supplier ID is required' });
  }
  const warrantyTypes = await getWarrantyTypesBySupplierId(supplierId);
  return res.json(warrantyTypes);
};
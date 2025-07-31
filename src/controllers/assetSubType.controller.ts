//fetch all asset sub types

import { Request, Response } from 'express';
import { getAllAssetSubTypes, createAssetSubType, getAssetSubTypeByAssetTypeId, getAssetSubTypeById } from '../services/assetSubType';

export const getAllAssetSubTypesController = async (_req: Request, res: Response) => {
  const assetSubTypes = await getAllAssetSubTypes();
  return res.json(assetSubTypes);
};

//fetch asset sub type by id  
export const getAssetSubTypeByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const assetSubType = await getAssetSubTypeById(id);
  return res.json(assetSubType);
};

//fetch asset sub type by asset type id
export const getAssetSubTypeByAssetTypeIdController = async (req: Request, res: Response) => {
  const { assetTypeId } = req.params;
  if (!assetTypeId) {
    return res.status(400).json({ error: 'Asset Type ID is required' });
  }
  const assetSubTypes = await getAssetSubTypeByAssetTypeId(assetTypeId);
  return res.json(assetSubTypes);
};

//create asset sub type
export const createAssetSubTypeController = async (req: Request, res: Response) => {
  const assetSubType = req.body;
  const newAssetSubType = await createAssetSubType(assetSubType);
  return res.json(newAssetSubType);
};


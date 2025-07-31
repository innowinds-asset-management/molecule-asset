// src/controllers/assetType.controller.ts

import { Request, Response } from 'express';
import { getAllAssetTypes } from '../services/assetType.service';

export const getAllAssetTypesController = async (_req: Request, res: Response) => {
  const assetTypes = await getAllAssetTypes();
  res.json(assetTypes);
};

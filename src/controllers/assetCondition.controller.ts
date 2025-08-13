// src/controllers/assetCondition.controller.ts

import { Request, Response } from 'express';
import { getAllAssetConditions } from '../services/assetCondition.service';

export const getAllAssetConditionsController = async (_req: Request, res: Response) => {
  const assetConditions = await getAllAssetConditions();
  res.json(assetConditions);
};

import { Request, Response } from 'express';
import { getAllAssetStatuses } from '../services/assetStatus.service';

export const getAllAssetStatusesController = async (_req: Request, res: Response) => {
  try {
    const assetStatuses = await getAllAssetStatuses();
    res.status(200).json({
      success: true,
      data: assetStatuses
    });
  } catch (error) {
    console.error('Error fetching asset statuses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch asset statuses'
    });
  }
};

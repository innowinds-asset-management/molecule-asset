//fetch all assets

import { Request, Response } from 'express';
import { getAllAssets, getAssetById, updateAsset, deleteAsset, createAssetFromGrnAndPoLineItemWithSerial, createAssetWithWarranty, getAssetCountByStatus, updateAssetWarranty } from '../services/asset.service';

export const getAllAssetsController = async (req: Request, res: Response) => {
  const { consumerId, supplierId, departmentId, groupstatus } = req.query; 
  const assets = await getAllAssets({
    consumerId: consumerId as string,
    supplierId: supplierId as string,
    departmentId: departmentId as string,
    status: groupstatus as string
  });
  return res.json(assets);
};

//fetch asset by id 
export const getAssetByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const asset = await getAssetById(id);
  return res.json(asset);
};


//update asset
export const updateAssetController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const asset = req.body;
  await updateAsset(id, asset);
  return res.json({
    success: true,
    message: 'Asset updated successfully',
    assetId: id
  });
};

//delete asset
export const deleteAssetController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {    
    return res.status(400).json({ error: 'ID is required' });
  }
  const deletedAsset = await deleteAsset(id);
  return res.json(deletedAsset);
};


//create asset from grn and po line item
export const createAssetFromGrnAndPoLineItemController = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await createAssetFromGrnAndPoLineItemWithSerial(data);
  return res.json(result);
};


//create asset with warranty
export const createAssetWithWarrantyController = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await createAssetWithWarranty(data);
  return res.json(result);
};

//get asset count by status
export const getAssetCountByStatusController = async (_req: Request, res: Response) => {
  try {
    const counts = await getAssetCountByStatus();
    return res.json({
      success: true,
      data: counts
    });
  } catch (error) {
    console.error('Error in getAssetCountByStatusController:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch asset counts by status'
    });
  }
};

//update asset and warranty
export const updateAssetWarrantyController = async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    const { consumerId } = req.body;
    const data = req.body;

    if (!assetId) {
      return res.status(400).json({ 
        success: false,
        error: 'Asset ID is required' 
      });
    }

    if (!consumerId) {
      return res.status(400).json({ 
        success: false,
        error: 'Consumer ID is required' 
      });
    }

    if (!data.asset || !data.warranty) {
      return res.status(400).json({ 
        success: false,
        error: 'Asset and warranty data are required' 
      });
    }

    const result = await updateAssetWarranty(assetId, consumerId, data);
    return res.json(result);
  } catch (error) {
    console.error('Error in updateAssetWarrantyController:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update asset and warranty'
    });
  }
};
//fetch all assets
import { AssetRequest } from '../middleware/userContextMiddleware';

import { Request, Response } from 'express';
import { getAllAssets, getAssetById, updateAsset, deleteAsset, createAssetFromGrnAndPoLineItemWithSerial, createAssetWithWarranty, getAssetCountByStatus, updateAssetWarranty } from '../services/asset.service';

export const getAllAssetsController = async (req: AssetRequest, res: Response) => {
  const { supplierId, departmentId, groupstatus } = req.query; 
  
  const consumerId = req._u?.consumerId;

      if (!consumerId) {
        return res.status(400).json({ error: 'Consumer ID is required' });
    }

    console.log('department id________>', departmentId)

  const assets = await getAllAssets(consumerId,{
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
export const createAssetFromGrnAndPoLineItemController = async (req: AssetRequest, res: Response) => {
  const data = req.body;
  data.consumerId = req._u?.consumerId;
  const result = await createAssetFromGrnAndPoLineItemWithSerial(data);
  return res.json(result);
};


//create asset with warranty
export const createAssetWithWarrantyController = async (req: AssetRequest, res: Response) => {
  const data = req.body;
  data.asset.consumerId = req._u?.consumerId;
  const result = await createAssetWithWarranty(data);
  return res.json(result);
};

//get asset count by status
export const getAssetCountByStatusController = async (req: AssetRequest, res: Response) => {
  try {
      const consumerId = req._u?.consumerId;
    const counts = await getAssetCountByStatus(consumerId!);
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
export const updateAssetWarrantyController = async (req: AssetRequest, res: Response) => {
  try {
    const { assetId } = req.params;
   // const { consumerId } = req.body;
    const consumerId = req._u?.consumerId;    
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
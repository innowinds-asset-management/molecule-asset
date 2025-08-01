//fetch all assets

import { Request, Response } from 'express';
import { getAllAssets, getAssetById, createAsset, updateAsset, deleteAsset } from '../services/asset.service';

export const getAllAssetsController = async (_req: Request, res: Response) => {
  const assets = await getAllAssets();
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

//create asset  
export const createAssetController = async (req: Request, res: Response) => {
  const asset = req.body;
  const newAsset = await createAsset(asset);
  return res.json(newAsset);
};

//update asset
export const updateAssetController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const asset = req.body;
  const updatedAsset = await updateAsset(id, asset);
  return res.json(updatedAsset);
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
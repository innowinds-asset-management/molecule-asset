//fetch all installations

import { Request, Response } from 'express';
import { getAllInstallations, getInstallationById, getInstallationByAssetId, createInstallation, updateInstallation, deleteInstallation } from '../services/installation.service';

export const getAllInstallationsController = async (_req: Request, res: Response) => {
  const installations = await getAllInstallations();
  return res.json(installations);
};

//fetch installation by id  
export const getInstallationByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const installation = await getInstallationById(id);
  return res.json(installation);
};

//fetch installation by asset id
export const getInstallationByAssetIdController = async (req: Request, res: Response) => {
  const { assetId } = req.params;
  if (!assetId) {
    return res.status(400).json({ error: 'Asset ID is required' });
  }
  const installation = await getInstallationByAssetId(assetId);
  return res.json(installation);
};

//create installation
export const createInstallationController = async (req: Request, res: Response) => {
  const installation = req.body;
  const newInstallation = await createInstallation(installation);
  return res.json(newInstallation);
};

//update installation
export const updateInstallationController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const installation = req.body;        
  const updatedInstallation = await updateInstallation(id, installation);
  return res.json(updatedInstallation);
};

//delete installation
export const deleteInstallationController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const deletedInstallation = await deleteInstallation(id);
  return res.json(deletedInstallation);
};

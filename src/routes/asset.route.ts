//asset routes

import { Router } from 'express';
import { getAllAssetsController, getAssetByIdController, createAssetController, updateAssetController, deleteAssetController } from '../controllers/asset.controller';

const router = Router();

//get all assets
router.get('/', getAllAssetsController);
//get asset by id
router.get('/:id', getAssetByIdController);
//create asset
router.post('/', createAssetController);
//update asset
router.put('/:id', updateAssetController);
//delete asset
router.delete('/:id', deleteAssetController);

export default router;
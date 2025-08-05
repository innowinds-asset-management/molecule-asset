//asset sub type routes

import { Router } from 'express';
import { getAllAssetSubTypesController, getAssetSubTypeByIdController, getAssetSubTypeByAssetTypeIdController, createAssetSubTypeController } from '../controllers/assetSubType.controller';

const router = Router();
//get all asset sub types   
router.get('/', getAllAssetSubTypesController);
//get asset sub type by asset type id
router.get('/by-asset-type/:assetTypeId', getAssetSubTypeByAssetTypeIdController);
//get asset sub type by id
router.get('/:id', getAssetSubTypeByIdController);
//create asset sub type
router.post('/', createAssetSubTypeController); 

export default router;
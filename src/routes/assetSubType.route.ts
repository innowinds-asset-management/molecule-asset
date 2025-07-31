//asset sub type routes

import { Router } from 'express';
import { getAllAssetSubTypesController, getAssetSubTypeByIdController, getAssetSubTypeByAssetTypeIdController, createAssetSubTypeController } from '../controllers/assetSubType.controller';

const router = Router();
//get all asset sub types   
router.get('/', getAllAssetSubTypesController);
//get asset sub type by id
router.get('/:id', getAssetSubTypeByIdController);
//get asset sub type by asset type id
router.get('/asset-type/:assetTypeId', getAssetSubTypeByAssetTypeIdController);
//create asset sub type
router.post('/', createAssetSubTypeController); 

export default router;
//asset sub type routes

import { Router } from 'express';
import { getAllAssetSubTypesController, getAssetSubTypeByIdController, getAssetSubTypeByAssetTypeIdController, createAssetSubTypeController, searchAssetSubTypesByAssetTypeIdController } from '../controllers/assetSubType.controller';

const router = Router();
//get all asset sub types   
router.get('/', getAllAssetSubTypesController);
//get asset sub type by asset type id
router.get('/by-asset-type/:assetTypeId', getAssetSubTypeByAssetTypeIdController);
//search asset sub types by asset type id and search word
router.get('/by-asset-type-searchable/:assetTypeId', searchAssetSubTypesByAssetTypeIdController);
//get asset sub type by id
router.get('/:id', getAssetSubTypeByIdController);
//create asset sub type
router.post('/', createAssetSubTypeController); 

export default router;
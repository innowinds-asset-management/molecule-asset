import { Router } from 'express';
import { getAllAssetStatusesController } from '../controllers/assetStatus.controller';

const router = Router();

// get all asset statuses   
router.get('/', getAllAssetStatusesController);

export default router;

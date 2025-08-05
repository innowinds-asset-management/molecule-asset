// src/routes/assetType.route.ts

import { Router } from 'express';
import { getAllAssetTypesController } from '../controllers/assetType.controller';

const router = Router();

//get all asset types
router.get('/', getAllAssetTypesController);

export default router;
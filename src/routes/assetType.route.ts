// src/routes/assetType.route.ts

import { Router } from 'express';
import { getAllAssetTypesController } from '../controllers/assetType.controller';

const router = Router();

router.get('/', getAllAssetTypesController);

export default router;
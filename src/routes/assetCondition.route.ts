// src/routes/assetCondition.route.ts

import { Router } from 'express';
import { getAllAssetConditionsController } from '../controllers/assetCondition.controller';

const router = Router();

//get all asset conditions
router.get('/', getAllAssetConditionsController);

export default router;

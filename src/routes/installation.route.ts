// src/routes/installation.route.ts

import { Router } from 'express';
import { 
  getAllInstallationsController, 
  getInstallationByIdController, 
  getInstallationByAssetIdController, 
  createInstallationController, 
  updateInstallationController, 
  deleteInstallationController 
} from '../controllers/installation.controller';

const router = Router();

//get all installations
router.get('/', getAllInstallationsController);
//get installation by id
router.get('/:id', getInstallationByIdController);
//get installation by asset id
router.get('/asset/:assetId', getInstallationByAssetIdController);
//create installation
router.post('/', createInstallationController);
//update installation
router.put('/:id', updateInstallationController);
//delete installation
router.delete('/:id', deleteInstallationController);

export default router; 
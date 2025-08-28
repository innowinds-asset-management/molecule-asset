//service contract routes
import { Router } from 'express';
import { getServiceContractByAssetIdController, createServiceContractController, updateServiceContractController, getAllServiceContractsByServiceSupplierIdController } from '../controllers/serviceContract.controller';

const router = Router();
//get service contract by asset id  /api/service-contract/asset/:assetId
router.get('/service-contract/asset/:assetId', getServiceContractByAssetIdController);
//create service contract
router.post('/service-contract', createServiceContractController);
//update service contract /api/service-contract/:contractId
router.put('/service-contract/:contractId', updateServiceContractController);
//get all service contracts by service supplier id /api/v1/service-contract/service-supplier/:serviceSupplierId
router.get('/service-supplier/:serviceSupplierId', getAllServiceContractsByServiceSupplierIdController);

export default router;
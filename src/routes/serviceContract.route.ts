//service contract routes
import { Router } from 'express';
import { getAllServiceContractsController, getServiceContractByAssetIdController, createServiceContractController, updateServiceContractController, getAllServiceContractsByServiceSupplierIdController, getAllServiceContractsByAssetIdController, getServiceContractStatsController } from '../controllers/serviceContract.controller';

const router = Router();
//get all service contracts
router.get('/', getAllServiceContractsController);
//get service contract by asset id  /api/v1/service-contract/asset/:assetId
router.get('/asset/:assetId', getServiceContractByAssetIdController);
//create service contract
router.post('/', createServiceContractController);
//update service contract /api/v1/service-contract/:contractId
router.put('/:contractId', updateServiceContractController);
//get all service contracts by service supplier id /api/v1/service-contract/service-supplier/:serviceSupplierId
router.get('/service-supplier/:serviceSupplierId', getAllServiceContractsByServiceSupplierIdController);
//get all service contracts by asset id /api/v1/service-contract/asset/:assetId
router.get('/asset-contract/:assetId', getAllServiceContractsByAssetIdController);
//get service contract stats /api/v1/service-contract/service-contract-stats
router.get('/service-contract-stats', getServiceContractStatsController);    

export default router;
// get service contract status by status id
import { Router } from 'express';
import { getServiceContractStatusController, getAllServiceContractStatusesController } from '../controllers/serviceContractStatus.controller';

const router = Router();

//get service contract status by status id
router.get('/:statusId', getServiceContractStatusController);

//get all service contract statuses
router.get('/', getAllServiceContractStatusesController);

export default router;
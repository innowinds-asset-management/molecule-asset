import express from 'express';
import { getAllServiceContractStatuses } from '../controllers/serviceContractStatusController';

const router = express.Router();

router.get('/', getAllServiceContractStatuses);

export default router;

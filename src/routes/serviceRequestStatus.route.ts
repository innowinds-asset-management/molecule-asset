// src/routes/serviceRequestStatus.route.ts

import { Router } from 'express';
import { getAllServiceRequestStatusesController } from '../controllers/serviceRequestStatus.controller';

const router = Router();

//get all service request statuses
router.get('/', getAllServiceRequestStatusesController);

export default router;

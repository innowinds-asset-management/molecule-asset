// routes/serviceFrequency.route.ts

import { Router } from 'express';
import { getAllServiceFrequenciesController } from '../controllers/serviceFrequency.controller';

const router = Router();

router.get('/', getAllServiceFrequenciesController);

export default router;
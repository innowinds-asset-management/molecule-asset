//contract type route
import { Router } from 'express';
import { getAllContactTypes } from '../controllers/contactTypeController';

const router = Router();

router.get('/', getAllContactTypes);

export default router;
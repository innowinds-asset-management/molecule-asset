// /api/v1/payment-terms
import { Router } from 'express';
import { getAllPaymentTermsController } from '../controllers/paymentTerm.controller';

const router = Router();

router.get('/', getAllPaymentTermsController);

export default router;
//consumer supplier route

import { Router } from 'express';
import { createConsumerSupplierController, getConsumerBySupplierIdController, getSupplierByConsumerIdController } from '../controllers/consumerSupplier.controller';

const router = Router();

//create consumer supplier
router.post('/', createConsumerSupplierController);

//fetch supplier by consumer id     
router.get('/supplier/:consumerId', getSupplierByConsumerIdController);

//fetch consumer by supplier id
router.get('/consumer/:supplierId', getConsumerBySupplierIdController);

export default router;

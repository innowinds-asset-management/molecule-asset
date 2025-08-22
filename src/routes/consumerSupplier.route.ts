//consumer supplier route

import { Router } from 'express';
import { countSuppliersByConsumerIdController, createConsumerSupplierController, getConsumerBySupplierIdController, getSupplierByConsumerIdController } from '../controllers/consumerSupplier.controller';

const router = Router();

//create consumer supplier
router.post('/', createConsumerSupplierController);

//fetch supplier by consumer id     
router.get('/supplier/:consumerId', getSupplierByConsumerIdController);

//fetch consumer by supplier id
router.get('/consumer/:supplierId', getConsumerBySupplierIdController);

//count suppliers by consumer id
router.get('/count/supplier/:consumerId', countSuppliersByConsumerIdController);

export default router;

//consumer supplier route

import { Router } from 'express';
import { countSuppliersByConsumerIdController, createConsumerSupplierController, getConsumerBySupplierIdController, getSupplierByConsumerIdController } from '../controllers/consumerSupplier.controller';

const router = Router();

//create consumer supplier
router.post('/', createConsumerSupplierController);

//fetch supplier by consumer id     
router.get('/supplier', getSupplierByConsumerIdController);

//fetch consumer by supplier id
router.get('/consumer/:supplierId', getConsumerBySupplierIdController);

//count suppliers by consumer id
router.get('/count/supplier', countSuppliersByConsumerIdController);

export default router;

//warranty type route

import { Router } from 'express';
import { getAllWarrantyTypesController, getWarrantyTypeByIdController, getWarrantyTypesByConsumerIdController, getWarrantyTypesBySupplierIdController } from '../controllers/warrantyType.controller';

const router = Router();

//get all warranty types
router.get('/', getAllWarrantyTypesController);

//get warranty type by id
router.get('/:id', getWarrantyTypeByIdController);

//get warranty types by consumer id
router.get('/consumer', getWarrantyTypesByConsumerIdController);

//get warranty types by supplier id
router.get('/supplier/:supplierId', getWarrantyTypesBySupplierIdController);

export default router;  
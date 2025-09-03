import { Router } from 'express';
import {
  createConsumerController,
  deleteConsumerController,
  getConsumerByIdController,
  linkSupplierToConsumerController,
  listConsumersController,
  listSuppliersForConsumerController,
  syncConsumerController,
  unlinkSupplierFromConsumerController,
  updateConsumerController,
} from '../controllers/consumer.controller';

const router = Router();

router.get('/', listConsumersController);
router.post('/', createConsumerController);
router.post('/sync', syncConsumerController); // New sync endpoint
router.get('/:id', getConsumerByIdController);
router.put('/:id', updateConsumerController);
router.delete('/:id', deleteConsumerController);

router.get('/:id/suppliers', listSuppliersForConsumerController);
router.post('/:id/suppliers', linkSupplierToConsumerController);
router.delete('/:id/suppliers/:supplierId', unlinkSupplierFromConsumerController);

export default router;




import { Router } from 'express';
import {
  createSupplierController,
  deleteSupplierController,
  getSupplierByIdController,
  linkConsumerToSupplierController,
  listConsumersForSupplierController,
  listSuppliersController,
  unlinkConsumerFromSupplierController,
  updateSupplierController,
} from '../controllers/supplier.controller';

const router = Router();

router.get('/', listSuppliersController);
router.post('/', createSupplierController);
router.get('/:id', getSupplierByIdController);
router.put('/:id', updateSupplierController);
router.delete('/:id', deleteSupplierController);

router.get('/:id/consumers', listConsumersForSupplierController);
router.post('/:id/consumers', linkConsumerToSupplierController);
router.delete('/:id/consumers/:consumerId', unlinkConsumerFromSupplierController);

export default router;




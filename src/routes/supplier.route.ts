import { Router } from 'express';
import {
  createSupplierController,
  deleteSupplierController,
  getSupplierByIdController,
  linkConsumerToSupplierController,
  listConsumersForSupplierController,
  unlinkConsumerFromSupplierController,
  updateSupplierController,
  listSuppliersOfConsumerWithStatsController,
  getSupplierDetailsByIdController,
  listSuppliersController,
} from '../controllers/supplier.controller';

const router = Router();

router.get('/', listSuppliersOfConsumerWithStatsController);
router.get('/all', listSuppliersController);
router.post('/', createSupplierController);

// More specific routes first
router.get('/:id/details', getSupplierDetailsByIdController);
router.get('/:id/consumers', listConsumersForSupplierController);
router.post('/:id/consumers', linkConsumerToSupplierController);
router.delete('/:id/consumers/:consumerId', unlinkConsumerFromSupplierController);

// Generic ID routes last
router.get('/:id', getSupplierByIdController);
router.put('/:id', updateSupplierController);
router.delete('/:id', deleteSupplierController);

export default router;




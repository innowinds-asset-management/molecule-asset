//purchase order routes

import { Router } from 'express';
import { getAllPurchaseOrdersController, getPurchaseOrderByIdController, createPurchaseOrderController, updatePurchaseOrderController, deletePurchaseOrderController } from '../controllers/po.controller';

const router = Router();
//get all purchase orders
router.get('/', getAllPurchaseOrdersController);
//get purchase order by id
router.get('/:id', getPurchaseOrderByIdController);
//create purchase order
router.post('/', createPurchaseOrderController);
//update purchase order
router.put('/:id', updatePurchaseOrderController);
//delete purchase order
router.delete('/:id', deletePurchaseOrderController);

export default router;
//purchase order line item routes

import { Router } from 'express';
import { getAllPurchaseOrderLineItemsController, getPurchaseOrderLineItemByIdController, createPurchaseOrderLineItemController, updatePurchaseOrderLineItemController, deletePurchaseOrderLineItemController } from '../controllers/poLineItem.controller';

const router = Router();
//get all purchase order line items
router.get('/', getAllPurchaseOrderLineItemsController);
//get purchase order line item by id
router.get('/:id', getPurchaseOrderLineItemByIdController);
//create purchase order line item
router.post('/', createPurchaseOrderLineItemController);
//update purchase order line item
router.put('/:id', updatePurchaseOrderLineItemController);
//delete purchase order line item
router.delete('/:id', deletePurchaseOrderLineItemController);

export default router;


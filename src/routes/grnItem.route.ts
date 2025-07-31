//goods received note item routes

import { Router } from 'express';
import { getAllGoodsReceivedNoteItemsController, getGoodsReceivedNoteItemByIdController, createGoodsReceivedNoteItemController, updateGoodsReceivedNoteItemController, deleteGoodsReceivedNoteItemController } from '../controllers/grnItem.controller';

const router = Router();
//get all goods received note items
router.get('/', getAllGoodsReceivedNoteItemsController);
//get goods received note item by id
router.get('/:id', getGoodsReceivedNoteItemByIdController);
//create goods received note item
router.post('/', createGoodsReceivedNoteItemController);
//update goods received note item
router.put('/:id', updateGoodsReceivedNoteItemController);
//delete goods received note item
router.delete('/:id', deleteGoodsReceivedNoteItemController);

export default router;
//goods received note routes

import { Router } from 'express';
import { getAllGoodsReceivedNotesController, getGoodsReceivedNoteByIdController, createGoodsReceivedNoteController, updateGoodsReceivedNoteController, deleteGoodsReceivedNoteController } from '../controllers/grn.controller';

const router = Router();
//get all goods received notes
router.get('/', getAllGoodsReceivedNotesController);
//get goods received note by id
router.get('/:id', getGoodsReceivedNoteByIdController);
//create goods received note
router.post('/', createGoodsReceivedNoteController);
//update goods received note
router.put('/:id', updateGoodsReceivedNoteController);
//delete goods received note
router.delete('/:id', deleteGoodsReceivedNoteController);

export default router;
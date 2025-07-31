//fetch all goods received notes

import { Request, Response } from 'express';
import { getAllGoodsReceivedNotes, getGoodsReceivedNoteById, createGoodsReceivedNote, updateGoodsReceivedNote, deleteGoodsReceivedNote } from '../services/grn.service';

export const getAllGoodsReceivedNotesController = async (_req: Request, res: Response) => {
  const goodsReceivedNotes = await getAllGoodsReceivedNotes();
  return res.json(goodsReceivedNotes);
};

//fetch goods received note by id
export const getGoodsReceivedNoteByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const goodsReceivedNote = await getGoodsReceivedNoteById(id);
  return res.json(goodsReceivedNote);
};

//create goods received note
export const createGoodsReceivedNoteController = async (req: Request, res: Response) => {
  const goodsReceivedNote = req.body;
  const newGoodsReceivedNote = await createGoodsReceivedNote(goodsReceivedNote);
  return res.json(newGoodsReceivedNote);
};

//update goods received note
export const updateGoodsReceivedNoteController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const goodsReceivedNote = req.body;
  const updatedGoodsReceivedNote = await updateGoodsReceivedNote(id, goodsReceivedNote);
  return res.json(updatedGoodsReceivedNote);
};

//delete goods received note
export const deleteGoodsReceivedNoteController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const deletedGoodsReceivedNote = await deleteGoodsReceivedNote(id);
  return res.json(deletedGoodsReceivedNote);
};
//fetch all goods received notes

import { Request, Response } from 'express';
import { getAllGoodsReceivedNotes, getGoodsReceivedNoteById, deleteGoodsReceivedNote, createGoodsReceivedNoteWithItems, updateGoodsReceivedNoteWithItems, getGoodsReceivedNoteByPoId } from '../services/grn.service';

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
  const payload = req.body;
  const created = await createGoodsReceivedNoteWithItems(payload);
  return res.json(created);
};

//update goods received note
export const updateGoodsReceivedNoteController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const payload = req.body;
  const updated = await updateGoodsReceivedNoteWithItems(id, payload);
  return res.json(updated);
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

//fetch goods received note by po id
export const getGoodsReceivedNoteByPoIdController = async (req: Request, res: Response) => {
  const { poId } = req.params;
  if (!poId) {
    return res.status(400).json({ error: 'PO ID is required' });
  }
  const goodsReceivedNote = await getGoodsReceivedNoteByPoId(poId);
  return res.json(goodsReceivedNote);
};
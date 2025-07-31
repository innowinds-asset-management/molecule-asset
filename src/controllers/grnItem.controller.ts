//goods received note item controller

import { Request, Response } from 'express';
import { getAllGoodsReceivedNoteItems, getGoodsReceivedNoteItemById, createGoodsReceivedNoteItem, updateGoodsReceivedNoteItem, deleteGoodsReceivedNoteItem } from '../services/grnItem.service';

export const getAllGoodsReceivedNoteItemsController = async (_req: Request, res: Response) => {
  const goodsReceivedNoteItems = await getAllGoodsReceivedNoteItems();
  return res.json(goodsReceivedNoteItems);
};

//get goods received note item by id
export const getGoodsReceivedNoteItemByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const goodsReceivedNoteItem = await getGoodsReceivedNoteItemById(id);
  return res.json(goodsReceivedNoteItem);
};

//create goods received note item
export const createGoodsReceivedNoteItemController = async (req: Request, res: Response) => {
  const goodsReceivedNoteItem = req.body;
  const newGoodsReceivedNoteItem = await createGoodsReceivedNoteItem(goodsReceivedNoteItem);
  return res.json(newGoodsReceivedNoteItem);
};

//update goods received note item
export const updateGoodsReceivedNoteItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const goodsReceivedNoteItem = req.body;
  const updatedGoodsReceivedNoteItem = await updateGoodsReceivedNoteItem(id, goodsReceivedNoteItem);
  return res.json(updatedGoodsReceivedNoteItem);
};

//delete goods received note item
export const deleteGoodsReceivedNoteItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  const deletedGoodsReceivedNoteItem = await deleteGoodsReceivedNoteItem(id);
  return res.json(deletedGoodsReceivedNoteItem);
};
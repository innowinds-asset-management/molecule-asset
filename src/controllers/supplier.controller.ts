import { Request, Response } from 'express';
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
  getConsumersForSupplier,
  linkConsumerToSupplier,
  unlinkConsumerFromSupplier,
  updateSupplier,
} from '../services/supplier.service';

export const listSuppliersController = async (_req: Request, res: Response) => {
  const rows = await getAllSuppliers();
  return res.json(rows);
};

export const getSupplierByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'id is required' });
  const row = await getSupplierById(id);
  if (!row) return res.status(404).json({ error: 'Supplier not found' });
  return res.json(row);
};

export const createSupplierController = async (req: Request, res: Response) => {
  const row = await createSupplier(req.body);
  return res.status(201).json(row);
};

export const updateSupplierController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'id is required' });
  const row = await updateSupplier(id, req.body);
  return res.json(row);
};

export const deleteSupplierController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'id is required' });
  const row = await deleteSupplier(id);
  return res.json(row);
};

export const listConsumersForSupplierController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'id is required' });
  const rows = await getConsumersForSupplier(id);
  return res.json(rows);
};

export const linkConsumerToSupplierController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { consumerId } = req.body as { consumerId?: string };
  if (!id || !consumerId) return res.status(400).json({ error: 'id and consumerId are required' });
  const row = await linkConsumerToSupplier(id, consumerId);
  return res.status(201).json(row);
};

export const unlinkConsumerFromSupplierController = async (req: Request, res: Response) => {
  const { id, consumerId } = req.params as { id?: string; consumerId?: string };
  if (!id || !consumerId) return res.status(400).json({ error: 'id and consumerId are required' });
  const row = await unlinkConsumerFromSupplier(id, consumerId);
  return res.json(row);
};




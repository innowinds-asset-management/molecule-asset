import { Request, Response } from 'express';
import {
  createConsumer,
  deleteConsumer,
  getAllConsumers,
  getConsumerById,
  getSuppliersForConsumer,
  linkSupplierToConsumer,
  unlinkSupplierFromConsumer,
  updateConsumer,
} from '../services/consumer.service';

export const listConsumersController = async (_req: Request, res: Response): Promise<void> => {
  const rows = await getAllConsumers();
  res.json(rows);
  return;
};

export const getConsumerByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'id is required' });
    return;
  }
  const row = await getConsumerById(id);
  if (!row) {
    res.status(404).json({ error: 'Consumer not found' });
    return;
  }
  res.json(row);
  return;
};

export const createConsumerController = async (req: Request, res: Response): Promise<void> => {
  const row = await createConsumer(req.body);
  res.status(201).json(row);
  return;
};

export const updateConsumerController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'id is required' });
    return;
  }
  const row = await updateConsumer(id, req.body);
  res.json(row);
  return;
};

export const deleteConsumerController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'id is required' });
    return;
  }
  const row = await deleteConsumer(id);
  res.json(row);
  return;
};

export const listSuppliersForConsumerController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'id is required' });
    return;
  }
  const rows = await getSuppliersForConsumer(id);
  res.json(rows);
  return;
};

export const linkSupplierToConsumerController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { supplierId } = req.body as { supplierId?: string };
  if (!id || !supplierId) {
    res.status(400).json({ error: 'id and supplierId are required' });
    return;
  }
  const row = await linkSupplierToConsumer(id, supplierId);
  res.status(201).json(row);
  return;
};

export const unlinkSupplierFromConsumerController = async (req: Request, res: Response): Promise<void> => {
  const { id, supplierId } = req.params as { id?: string; supplierId?: string };
  if (!id || !supplierId) {
    res.status(400).json({ error: 'id and supplierId are required' });
    return;
  }
  const row = await unlinkSupplierFromConsumer(id, supplierId);
  res.json(row);
  return;
};




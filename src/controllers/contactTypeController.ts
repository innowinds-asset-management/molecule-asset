//fetch all contact types
import { Request, Response } from 'express';
import { getAllContractTypes } from '../services/contractType.service';

export const getAllContactTypes = async (_req: Request, res: Response) => {
  const contactTypes = await getAllContractTypes();
  return res.json(contactTypes);
};
// controllers/serviceFrequency.controller.ts

import { Request, Response } from 'express';
import { getAllServiceFrequencies } from '../services/sericeFrequency.service';

export const getAllServiceFrequenciesController = async (_req: Request, res: Response) => {
  const serviceFrequencies = await getAllServiceFrequencies();
  res.json(serviceFrequencies);
};
// src/controllers/serviceRequestStatus.controller.ts

import { Request, Response } from 'express';
import { getAllServiceRequestStatuses } from '../services/serviceRequestStatus.service';

export const getAllServiceRequestStatusesController = async (_req: Request, res: Response) => {
  const serviceRequestStatuses = await getAllServiceRequestStatuses();
  res.json(serviceRequestStatuses);
};

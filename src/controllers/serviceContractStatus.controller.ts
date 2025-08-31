// get service contract status by status id
import { Request, Response } from 'express';
import { getAllServiceContractStatuses, getServiceContractStatus } from '../services/serviceContractStatus.service';

export const getServiceContractStatusController = async (req: Request, res: Response) => {
  const { statusId } = req.params;
  const serviceContractStatus = await getServiceContractStatus(Number(statusId));
  res.json(serviceContractStatus);
};

//get all service contract statuses 
export const getAllServiceContractStatusesController = async (_req: Request, res: Response) => {
  const serviceContractStatuses = await getAllServiceContractStatuses();
  res.json(serviceContractStatuses);
};
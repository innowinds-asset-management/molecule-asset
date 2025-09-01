import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllServiceContractStatuses = async (_req: Request, res: Response) => {
  try {
    const statuses = await prisma.serviceContractStatus.findMany();
    res.json(statuses);
  } catch (error) {
    console.error('Error fetching service contract statuses:', error);
    res.status(500).json({ error: 'Failed to fetch service contract statuses' });
  }
};

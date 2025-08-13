import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllServiceRequestStatuses = async () => {
  return await prisma.serviceRequestStatus.findMany();
};

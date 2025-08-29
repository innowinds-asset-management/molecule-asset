import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//fetch all contract types
export const getAllContractTypes = async () => {
  return prisma.contractType.findMany();
};


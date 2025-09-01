import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();  

// fetch all service frequencies
export const getAllServiceFrequencies = async () => {
  return await prisma.serviceFrequency.findMany();
};


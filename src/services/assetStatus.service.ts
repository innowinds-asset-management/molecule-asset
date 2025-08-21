import { PrismaClient } from '@prisma/client';  
    

const prisma = new PrismaClient();

export const getAllAssetStatuses = async () => {
  return await prisma.assetStatus.findMany();
};  
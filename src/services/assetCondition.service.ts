import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAssetConditions = async () => {
  return await prisma.assetCondition.findMany();
};

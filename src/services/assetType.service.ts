import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAssetTypes = async () => {
  return await prisma.assetType.findMany();
};

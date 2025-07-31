//fetch all asset sub types
import { PrismaClient, AssetSubType } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAssetSubTypes = async () => {
  return await prisma.assetSubType.findMany();
};  

//fetch asset sub type by id
export const getAssetSubTypeById = async (id: string) => {
  return await prisma.assetSubType.findUnique({
    where: { id },
  });
};

//fetch asset sub type by asset type id
export const getAssetSubTypeByAssetTypeId = async (assetTypeId: string) => {
  return await prisma.assetSubType.findMany({
    where: { assetTypeId },
  });
};


//create asset sub type
export const createAssetSubType = async (assetSubType: AssetSubType) => {
  return await prisma.assetSubType.create({
    data: assetSubType,
  });
};




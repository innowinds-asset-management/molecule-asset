//fetch all assets
import { Asset, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAssets = async () => {
  return await prisma.asset.findMany();
};

//fetch asset by id 
export const getAssetById = async (id: string) => {
  return await prisma.asset.findUnique({
    where: { id },
  });
};

//create asset
export const createAsset = async (asset: Asset) => {    
  return await prisma.asset.create({
    data: asset,
  });
};

//update asset
export const updateAsset = async (id: string, asset: Asset) => {
  return await prisma.asset.update({
    where: { id },      
    data: asset,
  });
};

//delete asset
export const deleteAsset = async (id: string) => {
  return await prisma.asset.delete({
    where: { id },
  });
};  
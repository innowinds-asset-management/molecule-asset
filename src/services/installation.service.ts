//fetch all installations

import { Installation, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllInstallations = async () => {
  return await prisma.installation.findMany();
};

//fetch installation by id
export const getInstallationById = async (id: string) => {
  return await prisma.installation.findUnique({
    where: { id },
  });
};

//create installation
export const createInstallation = async (installation: Installation) => {   
  return await prisma.installation.create({
    data: installation,
  });
};

//fetch installation by asset id
export const getInstallationByAssetId = async (assetId: string) => {
  return await prisma.installation.findMany({
    where: { assetId },
  });
};

//update installation
export const updateInstallation = async (id: string, installation: Installation) => {
  return await prisma.installation.update({
    where: { id },  
    data: installation,
  });
};

//delete installation
export const deleteInstallation = async (id: string) => {
  return await prisma.installation.delete({
    where: { id },
  });
};  
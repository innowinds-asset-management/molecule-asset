//fetch all warranties
import { Warranties, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllWarranties = async (supplierId?: string, consumerId?: string) => {
  return await prisma.warranties.findMany({
    where: {
      ...(supplierId && { supplierId }),
      ...(consumerId && { consumerId }),
    }, include: {
      warrantyType: true,
      asset: true,
      notifications: true,
    },
  });
};

//fetch warranty by id 
export const getWarrantyById = async (id: number) => {
  return await prisma.warranties.findUnique({
    where: { warrantyId: id },
    include: {
      warrantyType: true,
      asset: true,
      notifications: true,
    },
  });
};

//fetch warranties by asset id
export const getWarrantiesByAssetId = async (assetId: string) => {
  return await prisma.warranties.findMany({
    where: { assetId },
    include: {
      warrantyType: true,
      asset: true,
      notifications: true,
    },
  });
};

//create warranty
export const createWarranty = async (warranty: Omit<Warranties, 'warrantyId' | 'createdAt' | 'updatedAt'>) => {
  return await prisma.warranties.create({
    data: {
      ...warranty,
      startDate: new Date(warranty.startDate),
      endDate: new Date(warranty.endDate),
    },
    include: {
      warrantyType: true,
      asset: true,
      notifications: true,
    },
  });
};

//update warranty
export const updateWarranty = async (id: number, warranty: Partial<Warranties>) => {
  return await prisma.warranties.update({
    where: { warrantyId: id },
    data: {
      ...warranty,
      startDate: new Date(warranty.startDate!),
      endDate: new Date(warranty.endDate!),
    },
    include: {
      warrantyType: true,
      asset: true,
      notifications: true,
    },
  });
};

//delete warranty
export const deleteWarranty = async (id: number) => {
  return await prisma.warranties.delete({
    where: { warrantyId: id },
  });
};

//get warranty types
export const getAllWarrantyTypes = async (supplierId?: string, consumerId?: string) => {
  return await prisma.warrantyType.findMany({
    where: {
      ...(supplierId && { supplierId }),
      ...(consumerId && { consumerId }),
    },
  });
};

//get warranty type by id
export const getWarrantyTypeById = async (id: number) => {
  return await prisma.warrantyType.findUnique({
    where: { warrantyTypeId: id },
    include: {
      warranties: true,
    },
  });
};

//create warranty type
export const createWarrantyType = async (warrantyType: { typeName: string; description?: string, consumerId?: string, supplierId?: string }) => {
  return await prisma.warrantyType.create({
    data: warrantyType,
  });
};

//update warranty type
export const updateWarrantyType = async (id: number, warrantyType: { typeName?: string; description?: string }) => {
  return await prisma.warrantyType.update({
    where: { warrantyTypeId: id },
    data: warrantyType,
  });
};

//delete warranty type
export const deleteWarrantyType = async (id: number) => {
  return await prisma.warrantyType.delete({
    where: { warrantyTypeId: id },
  });
};


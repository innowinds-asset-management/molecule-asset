import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//fetch all warranty types
export const getAllWarrantyTypes = async () => {
  return prisma.warrantyType.findMany();
};

//fetch warranty type by id
export const getWarrantyTypeById = async (id: number) => {
  return prisma.warrantyType.findUnique({ where: { warrantyTypeId: id } });
};


//fetch warranty types by consumer id
export const getWarrantyTypesByConsumerId = async (consumerId: string) => {
  return prisma.warrantyType.findMany({ where: { consumerId } });
};

//fetch warranty types by supplier id
export const getWarrantyTypesBySupplierId = async (supplierId: string) => {
  return prisma.warrantyType.findMany({ where: { supplierId } });
};
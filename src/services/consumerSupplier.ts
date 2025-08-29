//fetc

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createConsumerSupplier = async (consumerId: string, supplierId: string) => {
  return prisma.consumerSupplier.create({
    data: { consumerId, supplierId },
  });
};  

//fetch supplier by consumer id
export const getSupplierByConsumerId = async (consumerId: string) => {
  return prisma.consumerSupplier.findMany({
    where: { consumerId },
    include: {
      supplier: true,
    },
  });
};


//fetch consumer by supplier id 
export const getConsumerBySupplierId = async (supplierId: string) => {
  return prisma.consumerSupplier.findMany({
    where: { supplierId },
  });
};


//count suppliers by consumer id
export const countSuppliersByConsumerId = async (consumerId: string) => {
  return prisma.consumerSupplier.count({
    where: { consumerId },
  });
};




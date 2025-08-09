import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllConsumers = async () => {
  return prisma.consumer.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getConsumerById = async (id: string) => {
  return prisma.consumer.findUnique({
    where: { id },
  });
};

export const createConsumer = async (data: {
  name: string;
  code: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive?: boolean;
}) => {
  return prisma.consumer.create({
    data,
  });
};

export const updateConsumer = async (
  id: string,
  data: Partial<{
    name: string;
    code: string;
    contactName?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    isActive?: boolean;
  }>
) => {
  return prisma.consumer.update({
    where: { id },
    data,
  });
};

export const deleteConsumer = async (id: string) => {
  return prisma.consumer.delete({
    where: { id },
  });
};

export const getSuppliersForConsumer = async (consumerId: string) => {
  return prisma.supplier.findMany({
    where: { consumerSuppliers: { some: { consumerId } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const linkSupplierToConsumer = async (consumerId: string, supplierId: string) => {
  return prisma.consumerSupplier.upsert({
    where: { consumerId_supplierId: { consumerId, supplierId } },
    update: {},
    create: { consumerId, supplierId },
  });
};

export const unlinkSupplierFromConsumer = async (consumerId: string, supplierId: string) => {
  return prisma.consumerSupplier.delete({
    where: { consumerId_supplierId: { consumerId, supplierId } },
  });
};




import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//fetch all supplers 
export const getAllSuppliers = async () => {
  return prisma.supplier.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getSupplierById = async (id: string) => {
  return prisma.supplier.findUnique({
    where: { id },
  });
};

export const createSupplier = async (data: {
  name: string;
  code: string;
  gstNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive?: boolean;
}) => {
  return prisma.supplier.create({
    data,
  });
};

export const updateSupplier = async (
  id: string,
  data: Partial<{
    name: string;
    code: string;
    gstNumber?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    isActive?: boolean;
  }>
) => {
  return prisma.supplier.update({
    where: { id },
    data,
  });
};

export const deleteSupplier = async (id: string) => {
  return prisma.supplier.delete({
    where: { id },
  });
};

export const getConsumersForSupplier = async (supplierId: string) => {
  return prisma.consumer.findMany({
    where: { consumerSuppliers: { some: { supplierId } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const linkConsumerToSupplier = async (supplierId: string, consumerId: string) => {
  return prisma.consumerSupplier.upsert({
    where: { consumerId_supplierId: { consumerId, supplierId } },
    update: {},
    create: { consumerId, supplierId },
  });
};

export const unlinkConsumerFromSupplier = async (supplierId: string, consumerId: string) => {
  return prisma.consumerSupplier.delete({
    where: { consumerId_supplierId: { consumerId, supplierId } },
  });
};

// Get all suppliers with asset counts and open service request counts

// Get suppliers of a consumer with asset counts and open service request counts
export const listSuppliersOfConsumerWithStats = async (consumerId: string) => {
  const consumerSuppliers = await prisma.consumerSupplier.findMany({
    where: {
      consumerId: consumerId
    },
    include: {
      supplier: {
        include: {
          _count: {
            select: {
              suppliedAssets: {
                where: {
                  consumerId: consumerId
                }
              },
              serviceRequests: {
                where: {
                  srStatusCode: 'OP' // Open status
                }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return consumerSuppliers.map(consumerSupplier => ({
    supplier: consumerSupplier.supplier,
    assetCount: consumerSupplier.supplier._count.suppliedAssets,
    openServiceRequestCount: consumerSupplier.supplier._count.serviceRequests,
    registeredFrom: consumerSupplier.createdAt
  }));
};

// Get supplier details by ID with asset counts and open service request counts
export const getSupplierDetailsById = async (id: string) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      consumerSuppliers:true,
      _count: {
        select: {
          suppliedAssets: true,
          serviceRequests: {
            where: {
              srStatusCode: 'OP' // Open status
            }
          }
        }
      }
    }
  });

  if (!supplier) {
    return null;
  }

  return {
    ...supplier,
    assetCount: supplier._count.suppliedAssets,
    openServiceRequestCount: supplier._count.serviceRequests
  };
};








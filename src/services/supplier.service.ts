import { PrismaClient } from '@prisma/client';
import { generateEntityId } from '../helper/helper';
import { ENTITY_NAMES, SERVICE_REQUEST_STATUS } from '../utils/constants';

const prisma = new PrismaClient();

// Search suppliers by consumer ID and search term
export const searchSuppliersByConsumer = async (searchTerm: string, consumerId: string) => {
  // console.log('cid=====>',consumerId)
 const where: any = {
  consumerId: consumerId,
  OR: [
    {
      supplierCode: {
        contains: searchTerm,
      },
    },
    {
      supplier: {
        name: {
          contains: searchTerm,
        },
      },
    },
  ],
};


return await prisma.consumerSupplier.findMany({
  where,
  select: {
    supplier: {
      select: {
        id: true,
        name: true,
        code: true,
        email: true,
        phone: true
      }
    }
  },
  orderBy: {
    supplier: {
      name: 'asc'
    }
  },
  take: 10 // Limit results to 10 suppliers
});
};

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
  code?: string | null;
  gstNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive?: boolean;
}) => {
  return prisma.supplier.create({
    data: {
      ...data,
      id: generateEntityId(ENTITY_NAMES.SUPPLIER)
    },
  });
};

export const createSupplierAndLinkToConsumer = async (
  supplierData: {
    name: string;
    code: string | null;
    gstNumber?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    isActive?: boolean;
  },
  consumerId: string
) => {
  console.log('supplier Data====>',supplierData)
  return prisma.$transaction(async (tx) => {
    // Create the supplier
    const supplier = await tx.supplier.create({
      data: {
        ...supplierData,
        id: generateEntityId(ENTITY_NAMES.SUPPLIER)
      },
    });

    // Create the consumer-supplier relationship
    const consumerSupplier = await tx.consumerSupplier.create({
      data: {
        consumerId,
        supplierId: supplier.id,
        supplierCode: supplierData.code
      },
    });

    return { supplier, consumerSupplier };
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
                  srStatusCode: SERVICE_REQUEST_STATUS.OPEN // Open status
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
      consumerSuppliers: true,
      _count: {
        select: {
          suppliedAssets: true,
          serviceRequests: true
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

export const createDefaultSupplierSignUp = async (consumerId:string) => {
  return prisma.$transaction(async (tx) => {
    // Create the supplier
    const supplier = await tx.supplier.create({
      data: {
        name:'Internal',
        id: generateEntityId(ENTITY_NAMES.SUPPLIER)
      },
    });

    // Create the consumer-supplier relationship
    const consumerSupplier = await tx.consumerSupplier.create({
      data: {
        consumerId,
        supplierId: supplier.id,
      },
    });

    return { supplier, consumerSupplier };
  });
};









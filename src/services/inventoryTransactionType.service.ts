import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all inventory transaction types
export const getAllInventoryTransactionTypes = async () => {
  return await prisma.inventoryTransactionType.findMany({
    select: {
      code: true,
      displayName: true
    },
    orderBy: {
      displayName: 'asc'
    }
  });
};

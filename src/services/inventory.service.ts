//fetch all inventory items
import { PrismaClient, UnitMeasure } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllInventory = async (consumerId: string ) => {
  const where: any = {};
  
  if (consumerId) {
    where.consumerId = consumerId;
  }
  
  return await prisma.inventory.findMany({
    where,
    include: {
      consumer: true,
      departmentInventory: {
        include: {
          department: true
        }
      },
      inventoryTransactions: {
        include: {
          department: true,
          supplier: true,
          transactionType: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
  });
};

// Search inventory items by name or item number
export const searchInventoryItems = async (searchTerm: string, consumerId: string) => {
  const where: any = {
    consumerId: consumerId,
    OR: [
      {
        itemName: {
          contains: searchTerm,
        }
      },
      {
        itemNo: {
          contains: searchTerm,
        }
      }
    ]
  };
  
  return await prisma.inventory.findMany({
    where,
    select: {
      id: true,
      itemName: true,
      itemNo: true,
      quantity: true,
      unitMeasure: true
    },
    orderBy: {
      itemName: 'asc'
    },
    take: 10 // Limit results to 10 items
  });
};

//fetch inventory by id 
export const getInventoryById = async (id: string) => {
  return await prisma.inventory.findUnique({
    where: { id },
    include: {
      consumer: true,
      departmentInventory: {
        include: {
          department: true
        }
      },
      inventoryTransactions: {
        include: {
          department: true,
          supplier: true,
          transactionType: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
  });
};

// Create or update inventory item
export const createOrUpdateInventory = async (data: {
  itemId?: string;
  itemName: string;
  quantity: number;
  unitMeasure?: UnitMeasure;
  consumerId: string;
  // Optional inventory transaction fields
  grnItemId?: string;
  poLineItemId?: string;
  expiredAt?: Date;
  supplierId?: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    let inventory;
    
    if (data.itemId) {
      // Update existing inventory item
      inventory = await tx.inventory.update({
        where: { id: data.itemId },
        data: {
          quantity: {
            increment: data.quantity
          },
          updatedAt: new Date()
        },
        include: {
          consumer: true,
          departmentInventory: {
            include: {
              department: true
            }
          },
          inventoryTransactions: {
            include: {
              department: true,
              supplier: true,
              transactionType: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    } else {
      // Create new inventory item
      inventory = await tx.inventory.create({
                data: {
          itemName: data.itemName,
          quantity: data.quantity,
          unitMeasure: data.unitMeasure || null,
          consumerId: data.consumerId
        },
        include: {
          consumer: true,
          departmentInventory: {
            include: {
              department: true
            }
          },
          inventoryTransactions: {
            include: {
              department: true,
              supplier: true,
              transactionType: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    }

    // Create inventory transaction
    await tx.inventoryTransactions.create({
      data: {
        inventoryId: inventory.id,
        departmentId: null,
        quantity: data.quantity,
        transactionTypeCode: 'IN',
        grnItemId: data.grnItemId || null,
        poLineItemId: data.poLineItemId || null,
        expiredAt: data.expiredAt || null,
        supplierId: data.supplierId || null
      }
    });

    return inventory;
  });
};

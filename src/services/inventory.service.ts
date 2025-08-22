//fetch all inventory items
import { PrismaClient, UnitMeasure } from '@prisma/client';
import { INVENTORY_TRANSACTION_TYPES, InventoryTransactionTypeCode, ENTITY_NAMES } from '../utils/constants';
import { generateEntityId } from '../helper/helper';

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
      // Check if the existing item has the same unit measure
      const existingItem = await tx.inventory.findUnique({
        where: { id: data.itemId },
        select: { unitMeasure: true }
      });
      
      if (existingItem && existingItem.unitMeasure === data.unitMeasure) {
        // Same unit measure - update existing inventory item
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
        // Different unit measure - create new inventory item
        inventory = await tx.inventory.create({
          data: {
            itemName: data.itemName,
            itemNo: generateEntityId(ENTITY_NAMES.INVENTORY),
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
    } else {
      // Create new inventory item
      inventory = await tx.inventory.create({
        data: {
          itemName: data.itemName,
          itemNo: generateEntityId(ENTITY_NAMES.INVENTORY),
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
        transactionTypeCode: INVENTORY_TRANSACTION_TYPES.IN,
        grnItemId: data.grnItemId || null,
        poLineItemId: data.poLineItemId || null,
        expiredAt: data.expiredAt || null,
        supplierId: data.supplierId || null
      }
    });

    return inventory;
  });
};

// Transfer inventory between departments or locations
export const transferInventory = async (data: {
  inventoryId: string;
  quantity: number;
  transactionTypeCode: InventoryTransactionTypeCode;
  departmentId?: string;
  supplierId?: string;
  grnItemId?: string;
  poLineItemId?: string;
  expiredAt?: Date;
  reason?: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    // Get inventory item with related data
    const inventory = await tx.inventory.findUnique({
      where: { id: data.inventoryId },
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

    if (!inventory) {
      throw new Error('Inventory item not found');
    }

    // Check if there's enough quantity for DEPT_OUT transactions
    if (data.transactionTypeCode === INVENTORY_TRANSACTION_TYPES.DEPT_OUT && inventory.quantity < data.quantity) {
      throw new Error('Insufficient inventory quantity for transfer');
    }

    // Handle department inventory management
    if (data.departmentId) {
      // Check if department inventory entry exists
      const existingDepartmentInventory = await tx.departmentInventory.findFirst({
        where: {
          departmentId: data.departmentId,
          inventoryId: data.inventoryId
        }
      });

      if (data.transactionTypeCode === INVENTORY_TRANSACTION_TYPES.DEPT_OUT) {
        // For DEPT_OUT, add to department inventory
        if (existingDepartmentInventory) {
          // Update existing entry
          await tx.departmentInventory.update({
            where: { id: existingDepartmentInventory.id },
            data: {
              quantity: {
                increment: data.quantity
              },
              updatedAt: new Date()
            }
          });
        } else {
          // Create new entry
          await tx.departmentInventory.create({
            data: {
              departmentId: data.departmentId,
              inventoryId: data.inventoryId,
              quantity: data.quantity
            }
          });
        }
      } else if (data.transactionTypeCode === INVENTORY_TRANSACTION_TYPES.DEPT_EXPIRED_RETURN || 
                 data.transactionTypeCode === INVENTORY_TRANSACTION_TYPES.DEPT_GENERAL_RETURN) {
        // For return transactions, subtract from department inventory
        if (!existingDepartmentInventory) {
          throw new Error(`No department inventory entry found for department ${data.departmentId} and inventory ${data.inventoryId}`);
        }

        if (existingDepartmentInventory.quantity < data.quantity) {
          throw new Error(`Insufficient quantity in department inventory. Available: ${existingDepartmentInventory.quantity}, Requested: ${data.quantity}`);
        }

        // Update department inventory by subtracting quantity
        await tx.departmentInventory.update({
          where: { id: existingDepartmentInventory.id },
          data: {
            quantity: {
              decrement: data.quantity
            },
            updatedAt: new Date()
          }
        });
      }
    }

    // Update inventory quantity based on transaction type
    let updatedInventory;
    if (data.transactionTypeCode === INVENTORY_TRANSACTION_TYPES.DEPT_OUT || data.transactionTypeCode === INVENTORY_TRANSACTION_TYPES.DISPOSED || data.transactionTypeCode === INVENTORY_TRANSACTION_TYPES.RESALE || data.transactionTypeCode === INVENTORY_TRANSACTION_TYPES.SUPPLIER_RETURN) {
      // Decrease quantity for outgoing transfers
      updatedInventory = await tx.inventory.update({
        where: { id: data.inventoryId },
        data: {
          quantity: {
            decrement: data.quantity
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
      // DEPT_IN - Increase quantity for incoming transfers
      updatedInventory = await tx.inventory.update({
        where: { id: data.inventoryId },
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
    }

    // Create inventory transaction record
    await tx.inventoryTransactions.create({
      data: {
        inventoryId: data.inventoryId,
        departmentId: data.departmentId || null,
        quantity: data.quantity,
        transactionTypeCode: data.transactionTypeCode,
        grnItemId: data.grnItemId || null,
        poLineItemId: data.poLineItemId || null,
        expiredAt: data.expiredAt || null,
        supplierId: data.supplierId || null,
        reason: data.reason || null
      }
    });

    return updatedInventory;
  });
};

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDepartmentInventoryByDepartmentAndInventory = async (departmentId: string, inventoryId: string) => {
  return await prisma.departmentInventory.findFirst({
    where: {
      departmentId: departmentId,
      inventoryId: inventoryId
    },
    include: {
      department: {
        select: {
          deptId: true,
          deptName: true
        }
      },
      inventory: {
        select: {
          id: true,
          itemName: true,
          itemNo: true,
          unitMeasure: true
        }
      }
    }
  });
};

export const getDepartmentInventoryByDepartment = async (departmentId: string) => {
  return await prisma.departmentInventory.findMany({
    where: {
      departmentId: departmentId
    },
    include: {
      department: {
        select: {
          deptId: true,
          deptName: true
        }
      },
      inventory: {
        select: {
          id: true,
          itemName: true,
          itemNo: true,
          unitMeasure: true
        }
      }
    }
  });
};

export const createDepartmentInventory = async (data: {
  departmentId: string;
  inventoryId: string;
  quantity: number;
}) => {
  return await prisma.departmentInventory.create({
    data: {
      departmentId: data.departmentId,
      inventoryId: data.inventoryId,
      quantity: data.quantity
    },
    include: {
      department: {
        select: {
          deptId: true,
          deptName: true
        }
      },
      inventory: {
        select: {
          id: true,
          itemName: true,
          itemNo: true,
          unitMeasure: true
        }
      }
    }
  });
};

export const updateDepartmentInventory = async (id: string, data: {
  quantity?: number;
}) => {
  return await prisma.departmentInventory.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date()
    },
    include: {
      department: {
        select: {
          deptId: true,
          deptName: true
        }
      },
      inventory: {
        select: {
          id: true,
          itemName: true,
          itemNo: true,
          unitMeasure: true
        }
      }
    }
  });
};

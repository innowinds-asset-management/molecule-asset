import { Department, PrismaClient } from '@prisma/client';
import { generateEntityId } from '../helper/helper';
import { ENTITY_NAMES } from '../utils/constants';

const prisma = new PrismaClient();

export const getAllDepartments = async () => {
  return await prisma.department.findMany();
};  

export const getDepartmentById = async (deptId: string) => {
  const department = await prisma.department.findUnique({
    where: { deptId },
  });

  if (!department) {
    return null;
  }

  // Get assets in this department
  const assets = await prisma.asset.findMany({
    where: { 
      departmentId: deptId,
      consumerId: department.consumerId
    },
    include: {
      assetType: true,
      assetSubType: true,
      supplier: true,
      department: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Get service requests for assets in this department
  const serviceRequests = await prisma.serviceRequest.findMany({
    where: {
      asset: {
        departmentId: deptId,
        consumerId: department.consumerId
      }
    },
    include: {
      serviceRequestItems: true,
      asset: {
        select: {
          assetName: true,
          id: true,
          consumerSerialNo: true
        }
      },
      warranty: {
        select: {
          isActive: true
        }
      },
      serviceSupplier: {
        select: {
          name: true
        }
      },
      serviceRequestStatus: true,
      assetCondition: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  // Count assets and open service requests
  const assetCount = await prisma.asset.count({
    where: { 
      departmentId: deptId,
      consumerId: department.consumerId
    },
  });

  const openServiceRequestCount = await prisma.serviceRequest.count({
    where: {
      asset: {
        departmentId: deptId,
        consumerId: department.consumerId
      },
      serviceRequestStatus: {
        code: 'OP' // Open status
      }
    },
  });

  return {
    ...department,
    assets,
    serviceRequests,
    assetCount,
    openServiceRequestCount,
  };
};

export const createDepartment = async (department: Department) => {
  return await prisma.department.create({
    data: {
      ...department,
      deptId: generateEntityId(ENTITY_NAMES.DEPARTMENT)
    },
  });
};

export const updateDepartment = async (deptId: string, department: Department) => {
  return await prisma.department.update({
    where: { deptId },
    data: department,
  });
};
  
//fetch all departments by consumer id with asset count and open service request count
export const getDepartmentsByConsumerId = async (consumerId: string) => {
  const departments = await prisma.department.findMany({
    where: { consumerId },
  });

  // Get asset count and open service request count for each department
  const departmentsWithCounts = await Promise.all(
    departments.map(async (department) => {
      // Count assets in this department
      const assetCount = await prisma.asset.count({
        where: { 
          departmentId: department.deptId,
          consumerId: consumerId
        },
      });

      // Count open service requests for assets in this department
      const openServiceRequestCount = await prisma.serviceRequest.count({
        where: {
          asset: {
            departmentId: department.deptId,
            consumerId: consumerId
          },
          serviceRequestStatus: {
            code: 'OP' // Open status
          }
        },
      });

      return {
        ...department,
        assetCount,
        openServiceRequestCount,
      };
    })
  );

  return departmentsWithCounts;
};

export const deleteDepartment = async (deptId: string) => { 
    return await prisma.department.delete({
        where: { deptId },
    });
};


//get department count by consumer id
export const getDepartmentCountByConsumerId = async (consumerId: string) => {
  return await prisma.department.count({
    where: { consumerId },
  });
};
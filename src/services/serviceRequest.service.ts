//fetch all service requests
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllServiceRequests = async () => {
  return await prisma.serviceRequest.findMany({
    include: {
      serviceRequestItems: true,
    },
  });
};

//fetch service request by id 
export const getServiceRequestById = async (id: string) => {
  return await prisma.serviceRequest.findUnique({
    where: { serviceRequestId: id },
    include: {
      serviceRequestItems: true,
    },
  });
};

//fetch service requests by asset id
export const getServiceRequestsByAssetId = async (assetId: string) => {
  return await prisma.serviceRequest.findMany({
    where: { assetId },
    include: {
      serviceRequestItems: true,
    },
  });
};

//create service request
export const createServiceRequest = async (serviceRequest: any) => {
  const {
    serviceRequestItems = [],
    // whitelist rest fields to avoid Prisma unknown args
    assetId,
    technicianName,
    serviceSupplierId,
    serviceContractId,
    warrantyStatus,
    srStatus,
    srNo,
    serviceDate,
    serviceType,
    serviceDescription,
    approverName,
  } = serviceRequest || {};

  const itemsData = (Array.isArray(serviceRequestItems) ? serviceRequestItems : []).map((item: any) => {
    const partCost = item?.partCost ?? null;
    const labourCost = item?.labourCost ?? null;
    const quantity = item?.quantity ?? null;
    const totalCost = item?.totalCost ?? null;
    return {
      partName: item?.partName,
      partCost,
      labourCost,
      quantity,
      totalCost,
      defectDescription: item?.defectDescription ?? null,
    };
  });

  return await prisma.serviceRequest.create({
    data: {
      assetId,
      technicianName,
      serviceSupplierId,
      serviceContractId,
      warrantyStatus,
      srStatus,
      srNo,
      serviceDate,
      serviceType,
      serviceDescription,
      approverName,
      ...(itemsData.length > 0
        ? {
            serviceRequestItems: {
              create: itemsData,
            },
          }
        : {}),
    },
    include: {
      serviceRequestItems: true,
    },
  });
};

//update service request
export const updateServiceRequest = async (id: string, serviceRequest: any) => {
  const {
    serviceRequestItems = [],
    assetId,
    technicianName,
    serviceSupplierId,
    serviceContractId,
    warrantyStatus,
    srStatus,
    srNo,
    serviceDate,
    serviceType,
    serviceDescription,
    approverName,
  } = serviceRequest || {};

  const itemsData = (Array.isArray(serviceRequestItems) ? serviceRequestItems : []).map((item: any) => ({
    partName: item?.partName,
    partCost: item?.partCost ?? null,
    labourCost: item?.labourCost ?? null,
    quantity: item?.quantity ?? null,
    totalCost: item?.totalCost ?? null,
    defectDescription: item?.defectDescription ?? null,
  }));

  return await prisma.serviceRequest.update({
    where: { serviceRequestId: id },
    data: {
      assetId,
      technicianName,
      serviceSupplierId,
      serviceContractId,
      warrantyStatus,
      srStatus,
      srNo,
      serviceDate,
      serviceType,
      serviceDescription,
      approverName,
      // Replace all existing items with provided list (if any)
      ...(Array.isArray(serviceRequestItems)
        ? {
            serviceRequestItems: {
              deleteMany: {},
              create: itemsData,
            },
          }
        : {}),
    },
    include: {
      serviceRequestItems: true,
    },
  });
};

//delete service request
export const deleteServiceRequest = async (id: string) => {
  // Delete child items first to satisfy FK constraints
  await prisma.serviceRequestItem.deleteMany({ where: { serviceRequestId: id } });
  return await prisma.serviceRequest.delete({
    where: { serviceRequestId: id },
  });
};

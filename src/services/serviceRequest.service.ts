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
      //serviceRequestItems: true,
      asset: {
        include: {
          installations: true,
        }
      },
      serviceSupplier: true,
      serviceContract: true,
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

//create service request with items
export const createServiceRequestWithItems = async (serviceRequest: any) => {
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
    assetCondition,
    problem,
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
      assetCondition,
      problem,
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

//create service request (header only)
export const createServiceRequest = async (serviceRequest: any) => {
  try {
    // Validate input
    if (!serviceRequest) {
      throw new Error('Service request data is required');
    }

    const {
      assetId,
      problem,
      assetCondition,
    } = serviceRequest || {};

    // Validate required fields
    if (!assetId) {
      throw new Error('Asset ID is required');
    }

    if (!problem) {
      throw new Error('Problem description is required');
    }

    if (!assetCondition) {
      throw new Error('Asset condition is required');
    }

    // Check if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!existingAsset) {
      throw new Error(`Asset with ID ${assetId} does not exist`);
    }

    // Create the service request with minimal data
    const newServiceRequest = await prisma.serviceRequest.create({
      data: {
        assetId,
        problem,
        assetCondition,
        // Set default values for required fields
        technicianName: 'Not Specified',
        warrantyStatus: 'NOT_APPLICABLE',
        serviceDate: new Date(),
      },
      include: {
        serviceRequestItems: true,
        asset: {
          select: {
            id: true,
            assetName: true,
            assetType: {
              select: {
                assetName: true
              }
            },
            assetSubType: {
              select: {
                name: true
              }
            }
          }
        },
        serviceSupplier: {
          select: {
            id: true,
            name: true
          }
        },
        serviceContract: {
          select: {
            contractId: true,
            contractName: true
          }
        }
      }
    });

    return newServiceRequest;

  } catch (error: any) {
    // Log the error for debugging
    console.error('Error creating service request:', error);
    
    // Re-throw the error with a more user-friendly message if it's a Prisma error
    if (error.code === 'P2002') {
      throw new Error('A service request with this information already exists');
    }
    
    if (error.code === 'P2003') {
      throw new Error('Foreign key constraint failed. Please check the provided IDs');
    }
    
    if (error.code === 'P2014') {
      throw new Error('The change you are trying to make would violate the required relation');
    }
    
    // Re-throw the original error if it's our custom validation error
    if (error.message && !error.code) {
      throw error;
    }
    
    // Generic error for unexpected issues
    throw new Error('Failed to create service request. Please try again later.');
  }
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
    assetCondition,
    problem,
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
      assetCondition,
      problem,
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

//create service request item
export const createServiceRequestItem = async (serviceRequestId: string, item: any) => {
  const {
    partName,
    partCost,
    labourCost,
    quantity,
    totalCost,
    defectDescription,
  } = item || {};

  return await prisma.serviceRequestItem.create({
    data: {
      serviceRequestId,
      partName,
      partCost: partCost ?? null,
      labourCost: labourCost ?? null,
      quantity: quantity ?? null,
      totalCost: totalCost ?? null,
      defectDescription: defectDescription ?? null,
    },
  });
};

//create multiple service request items
export const createServiceRequestItems = async (serviceRequestId: string, items: any[]) => {
  const itemsData = items.map((item: any) => ({
    serviceRequestId,
    partName: item?.partName,
    partCost: item?.partCost ?? null,
    labourCost: item?.labourCost ?? null,
    quantity: item?.quantity ?? null,
    totalCost: item?.totalCost ?? null,
    defectDescription: item?.defectDescription ?? null,
  }));

  return await prisma.serviceRequestItem.createMany({
    data: itemsData,
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

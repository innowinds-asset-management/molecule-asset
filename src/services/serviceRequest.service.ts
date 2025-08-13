//fetch all service requests
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllServiceRequests = async () => {
  return await prisma.serviceRequest.findMany({
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      serviceRequestItems: true,
      asset: {
        select: {
          assetName: true,
          id: true,
          department: {
            select: {
              deptName: true
            }
          }
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
      serviceRequestStatus:true,
      assetCondition:true

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
      serviceRequestItems: {
        where: {
          isDeleted: false
        }
      },
      warranty: true
    },
  });
};

//fetch service requests by asset id
export const getServiceRequestsByAssetId = async (assetId: string) => {
  return await prisma.serviceRequest.findMany({
    where: { assetId },
    include: {
      serviceRequestItems: true,
      serviceSupplier: true,
      serviceRequestStatus:true
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
    // srStatus,
    srNo,
    serviceType,
    serviceDescription,
    // assetCondition,
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
      // srStatus,
      srNo,
      serviceType,
      serviceDescription,
      // assetCondition,
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
      assetConditionCode
    } = serviceRequest || {};

    // Validate required fields
    if (!assetId) {
      throw new Error('Asset ID is required');
    }

    if (!problem) {
      throw new Error('Problem description is required');
    }

    if (!assetConditionCode) {
      throw new Error('Asset condition is required');
    }

    // Check if asset exists and get supplierId
    const existingAsset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        supplier: true
      }
    });

    if (!existingAsset) {
      throw new Error(`Asset with ID ${assetId} does not exist`);
    }

    // Get supplierId from asset for serviceSupplierId mapping
    const serviceSupplierId = existingAsset.supplierId || null;

    // Find warranty for the asset
    let warrantyId = null;

    // First, try to find warranties for the asset
    const warranties = await prisma.warranties.findMany({
      where: {
        assetId: assetId,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });


    if (warranties?.length) {
      warrantyId = warranties.find(w => w.isActive)?.warrantyId
        ?? warranties[0]?.warrantyId
        ?? null;
    }

    // Create the service request with minimal data
    const newServiceRequest = await prisma.serviceRequest.create({
      data: {
        assetId,
        problem,
        // assetCondition,
        serviceSupplierId, // Map supplierId from asset to serviceSupplierId
        // Set default values for required fields
        technicianName: 'Not Specified',
        warrantyId,
        // srStatus: 'OPEN'
        assetConditionCode,
        srStatusCode: 'OP'

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
    // serviceRequestItems = [],
    assetId,
    technicianName,
    serviceSupplierId,
    serviceContractId,
    // srStatus,
    srStatusCode,
    assetConditionCode,
    srNo,
    serviceType,
    serviceDescription,
    // assetCondition,
    problem,
    approverName,
    closureReason,
    closureNotes

  } = serviceRequest || {};

  // const itemsData = (Array.isArray(serviceRequestItems) ? serviceRequestItems : []).map((item: any) => ({
  //   partName: item?.partName,
  //   partCost: item?.partCost ?? null,
  //   labourCost: item?.labourCost ?? null,
  //   quantity: item?.quantity ?? null,
  //   totalCost: item?.totalCost ?? null,
  //   defectDescription: item?.defectDescription ?? null,
  // }));

  return await prisma.serviceRequest.update({
    where: { serviceRequestId: id },
    data: {
      assetId,
      technicianName,
      serviceSupplierId,
      serviceContractId,
      // srStatus,
      srStatusCode,
      assetConditionCode,
      srNo,
      serviceType,
      serviceDescription,
      // assetCondition,
      problem,
      approverName,
      closureReason,
      closureNotes,
      updatedAt: new Date()
      // // Replace all existing items with provided list (if any)
      // ...(Array.isArray(serviceRequestItems)
      //   ? {
      //       serviceRequestItems: {
      //         deleteMany: {},
      //         create: itemsData,
      //       },
      //     }
      //   : {}),
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

//update service request item
export const updateServiceRequestItem = async (serviceRequestItemId: string, item: any) => {
  const {
    partName,
    partCost,
    labourCost,
    quantity,
    totalCost,
    defectDescription,
  } = item || {};

  return await prisma.serviceRequestItem.update({
    where: { serviceRequestItemId: parseInt(serviceRequestItemId) },
    data: {
      partName,
      partCost: partCost ?? null,
      labourCost: labourCost ?? null,
      quantity: quantity ?? null,
      totalCost: totalCost ?? null,
      defectDescription: defectDescription ?? null,
    },
  });
};

//delete service request item
export const deleteServiceRequestItem = async (serviceRequestItemId: string) => {
  return await prisma.serviceRequestItem.update({
    where: { serviceRequestItemId: parseInt(serviceRequestItemId) },
    data: {
      isDeleted: true,
      deletedAt: new Date()
    },
  });
};

//delete service request
export const deleteServiceRequest = async (id: string) => {
  // Delete child items first to satisfy FK constraints
  await prisma.serviceRequestItem.updateMany({ where: { serviceRequestId: id }, data: { isDeleted: true } });
  return await prisma.serviceRequest.delete({
    where: { serviceRequestId: id },
  });
};

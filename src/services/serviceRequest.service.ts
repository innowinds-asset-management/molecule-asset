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
export const getServiceRequestById = async (id: number) => {
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
  return await prisma.serviceRequest.create({
    data: serviceRequest,
    include: {
      serviceRequestItems: true,
    },
  });
};

//update service request
export const updateServiceRequest = async (id: number, serviceRequest: any) => {
  return await prisma.serviceRequest.update({
    where: { serviceRequestId: id },      
    data: serviceRequest,
    include: {
      serviceRequestItems: true,
    },
  });
};

//delete service request
export const deleteServiceRequest = async (id: number) => {
  return await prisma.serviceRequest.delete({
    where: { serviceRequestId: id },
  });
};

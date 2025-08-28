import { PrismaClient, ServiceContract } from '@prisma/client';


const prisma = new PrismaClient();

// get service contract by asset id
export const getServiceContractByAssetId = async (assetId: string) => {
  const serviceContract = await prisma.serviceContract.findFirst({
    where: { assetId: assetId },
    include: { asset: true },
    orderBy: { startDate: 'desc' },

  });
  return serviceContract;
};  


// create service contract
export const createServiceContract = async (serviceContract: ServiceContract) => {
  const newServiceContract = await prisma.serviceContract.create({
    data: serviceContract,
  });
  return newServiceContract;
};


// update service contract
export const updateServiceContract = async (contractId: string, serviceContract: ServiceContract) => {
  const updatedServiceContract = await prisma.serviceContract.update({
    where: { contractId },
    data: serviceContract,
  });
  return updatedServiceContract;
};

//fetch all service based on  serviceSupplierId
export const getAllServiceContractsByServiceSupplierId = async (serviceSupplierId: string) => {
  const serviceContracts = await prisma.serviceContract.findMany({
    where: { serviceSupplierId },
    include: { 
      asset: {
        select: {
          id: true,
          assetName: true,
      }},
      serviceSupplier: {
        select: {
            id: true,
            name: true,
          }
      },
      status: true,
      contractType: true,      
    },
  });
  return serviceContracts;
};    
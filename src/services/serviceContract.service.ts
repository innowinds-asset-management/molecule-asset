import { PrismaClient, ServiceContract } from '@prisma/client';
import { ASSET_STATUS_ARRAYS, ASSET_STATUS_GROUPS } from '../utils/constants';


const prisma = new PrismaClient();

// get all service contracts
export const getAllServiceContracts = async (groupstatus?: string, consumerId?: string) => {  
  const where: any = {};
  if (groupstatus === ASSET_STATUS_GROUPS.ACTIVE_OR_PRE_ACTIVE) {
    where.asset = {
      consumerId: consumerId,
      status: {
        in: ASSET_STATUS_ARRAYS.ACTIVE_OR_PRE_ACTIVE_STATUSES
      }
    };
  }
  
  const serviceContracts = await prisma.serviceContract.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include: { 
      asset: {
        select: {
          id: true,
          assetName: true,
          status: true,
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
    orderBy: { createdAt: 'desc' },
  });
  return serviceContracts;
};

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
export const createServiceContract = async (serviceContractData: any) => {
  const serviceNumber = await prisma.serviceContract.count() + 1;
  // Generate contract number in the format SC-YYYY-XXX (e.g., SC-2024-002)
  const currentYear = new Date().getFullYear();
  const paddedNumber = String(serviceNumber).padStart(3, '0');
  const serviceContractNumber = `SC-${currentYear}-${paddedNumber}`;
  
  const newServiceContract = await prisma.serviceContract.create({
    data: {
      contractNumber: serviceContractNumber,
      contractTypeId: serviceContractData.contractTypeId,
      serviceSupplierId: serviceContractData.serviceSupplierId,
      assetId: serviceContractData.assetId,
      contractName: serviceContractData.contractName,
      amount: serviceContractData.amount,
      startDate: new Date(serviceContractData.startDate),
      endDate: new Date(serviceContractData.endDate),
      paymentTerms: serviceContractData.paymentTerms,
      coverageType: 'COMPREHENSIVE', // Always use COMPREHENSIVE as it's a valid enum value
      includes: serviceContractData.includes,
      excludes: serviceContractData.excludes,
      serviceFrequency: serviceContractData.serviceFrequency || 'QUARTERLY',
      preventiveMaintenanceIncluded: serviceContractData.preventiveMaintenanceIncluded,
      breakdownMaintenanceIncluded: serviceContractData.breakdownMaintenanceIncluded,
      autoRenewal: serviceContractData.autoRenewal,
      createdBy: serviceContractData.createdBy,
      updatedBy: serviceContractData.updatedBy,
      statusId: serviceContractData.statusId,
    },
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


// fetch all service contracts by asset id
export const getAllServiceContractsByAssetId = async (assetId: string) => {
  const serviceContracts = await prisma.serviceContract.findMany({
    where: { assetId },
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
    //orderBy: { createdAt: 'desc' },
  });
  return serviceContracts;
};  
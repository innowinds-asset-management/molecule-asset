import { PrismaClient, ServiceContract } from '@prisma/client';
import { ASSET_STATUS_ARRAYS, ASSET_STATUS_GROUPS, SERVICE_CONTRACT_STATS_TEXT } from '../utils/constants';


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


//fetch service contract stats based on expiring soon and recently expired service contracts
export const getServiceContractStats = async (consumerId: string, groupstatus?: string) => {
  console.log("[ServiceContract Stats] Starting stats calculation");
  console.log("[ServiceContract Stats] Input parameters:", { consumerId, groupstatus });

  const where: any = {};
  if (groupstatus === ASSET_STATUS_GROUPS.ACTIVE_OR_PRE_ACTIVE) {
    where.asset = {
      consumerId: consumerId,
      status: {
        in: ASSET_STATUS_ARRAYS.ACTIVE_OR_PRE_ACTIVE_STATUSES
      }
    };
  }
  console.log("[ServiceContract Stats] Database query where clause:", where);
  
  const serviceContracts = await prisma.serviceContract.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include: {
      asset: true,
      serviceSupplier: true,
      status: true,
      contractType: true,
    },
  });

  
  const now = new Date();
  const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  console.log("[ServiceContract Stats] Date ranges:");
  console.log("  - Current time:", now.toISOString());
  console.log("  - 5 days from now:", fiveDaysFromNow.toISOString());
  console.log("  - 10 days from now:", tenDaysFromNow.toISOString());
  console.log("  - 30 days from now:", thirtyDaysFromNow.toISOString());
  console.log("  - 5 days ago:", fiveDaysAgo.toISOString());
  console.log("  - 10 days ago:", tenDaysAgo.toISOString());
  console.log("  - 30 days ago:", thirtyDaysAgo.toISOString());

  // Expiring soon filters
  const expiringIn5Days = serviceContracts.filter(sc => 
    sc.endDate && sc.endDate > now && sc.endDate <= fiveDaysFromNow
  );
  const expiringIn10Days = serviceContracts.filter(sc => 
    sc.endDate && sc.endDate > now && sc.endDate <= tenDaysFromNow
  );
  const expiringIn30Days = serviceContracts.filter(sc => 
    sc.endDate && sc.endDate > now && sc.endDate <= thirtyDaysFromNow
  );

  console.log("[ServiceContract Stats] Expiring soon contracts:");
  console.log("  - In 5 days:", expiringIn5Days.length, "contracts");
  console.log("  - In 10 days:", expiringIn10Days.length, "contracts");
  console.log("  - In 30 days:", expiringIn30Days.length, "contracts");
  
  if (expiringIn5Days.length > 0) {
    console.log("  - 5 days details:", expiringIn5Days.map(sc => ({
      id: sc.contractId,
      contractNumber: sc.contractNumber,
      endDate: sc.endDate,
      assetName: sc.asset?.assetName
    })));
  }

  // Recently expired filters
  const expiredInLast5Days = serviceContracts.filter(sc => 
    sc.endDate && sc.endDate < now && sc.endDate >= fiveDaysAgo
  );
  const expiredInLast10Days = serviceContracts.filter(sc => 
    sc.endDate && sc.endDate < now && sc.endDate >= tenDaysAgo
  );
  const expiredInLast30Days = serviceContracts.filter(sc => 
    sc.endDate && sc.endDate < now && sc.endDate >= thirtyDaysAgo
  );

  console.log("[ServiceContract Stats] Recently expired contracts:");
  console.log("  - In last 5 days:", expiredInLast5Days.length, "contracts");
  console.log(expiredInLast5Days);
  console.log("  - In last 10 days:", expiredInLast10Days.length, "contracts");
  console.log(expiredInLast10Days);
  console.log("  - In last 30 days:", expiredInLast30Days.length, "contracts");
  console.log(expiredInLast30Days);
  

  const totalServiceContracts = serviceContracts.length;
  console.log("[ServiceContract Stats] Total service contracts:", totalServiceContracts);

  return {  
    totalServiceContracts,
    expiringSoon: { 
      in5Days:{title: SERVICE_CONTRACT_STATS_TEXT.expiringSoon.title, count: expiringIn5Days.length,text: SERVICE_CONTRACT_STATS_TEXT.expiringSoon.in5Days},
      in10days:{ title: SERVICE_CONTRACT_STATS_TEXT.expiringSoon.title, count: expiringIn10Days.length,text: SERVICE_CONTRACT_STATS_TEXT.expiringSoon.in10Days},
      in30days:{ title: SERVICE_CONTRACT_STATS_TEXT.expiringSoon.title, count: expiringIn30Days.length,text: SERVICE_CONTRACT_STATS_TEXT.expiringSoon.in30Days},
    },
    recentlyExpired: {  
      in5Days:{ title: SERVICE_CONTRACT_STATS_TEXT.recentlyExpired.title, count: expiredInLast5Days.length,text: SERVICE_CONTRACT_STATS_TEXT.recentlyExpired.inLast5Days},
      in10Days:{ title: SERVICE_CONTRACT_STATS_TEXT.recentlyExpired.title, count: expiredInLast10Days.length,text: SERVICE_CONTRACT_STATS_TEXT.recentlyExpired.inLast10Days},
      in30Days:{ title: SERVICE_CONTRACT_STATS_TEXT.recentlyExpired.title, count: expiredInLast30Days.length,text: SERVICE_CONTRACT_STATS_TEXT.recentlyExpired.inLast30Days},
    },
  };
  
};


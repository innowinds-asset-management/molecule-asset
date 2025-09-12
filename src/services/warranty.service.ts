//fetch all warranties
import { Warranties, PrismaClient } from '@prisma/client';
import { WARRANTY_STATS_TEXT } from '../utils/constants';
import { FILTER_TYPES } from '../utils/constants';


const prisma = new PrismaClient();

export const getAllWarranties = async (consumerId?: string, filter?: { type: typeof FILTER_TYPES.expiring | typeof FILTER_TYPES.expired; days: number }) => {
  // Calculate date filters if provided
  let dateFilter: any = {};
  if (filter) {
    const today = new Date();
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    if (filter.type === FILTER_TYPES.expiring) {
      // For expiring warranties, check if they expire within the specified days
      const futureDate = new Date(currentDate.getTime() + filter.days * 24 * 60 * 60 * 1000);
      dateFilter = {
        endDate: {
          gte: currentDate,
          lte: futureDate
        }
      };
    } else if (filter.type === FILTER_TYPES.expired) {
      // For expired warranties, check if they expired within the specified days
      const pastDate = new Date(currentDate.getTime() - filter.days * 24 * 60 * 60 * 1000);
      dateFilter = {
        endDate: {
          gte: pastDate,
          lt: currentDate
        }
      };
    }
  }
  
  return await prisma.warranties.findMany({
    where: {
      ...(consumerId && { consumerId }),
      // Add date filter if provided
      ...dateFilter,
      // Only include active warranties
      isActive: true
    }, include: {
      warrantyType: true,
      asset: {
        select: {
          id: true,
          assetName: true,
          supplier: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      notifications: true,      
    },
  });
};

//fetch warranty by id 
export const getWarrantyById = async (id: number) => {
  return await prisma.warranties.findUnique({
    where: { warrantyId: id },
    include: {
      warrantyType: true,
      asset: true,
      notifications: true,
    },
  });
};

//fetch warranties by asset id
export const getWarrantiesByAssetId = async (assetId: string) => {
  return await prisma.warranties.findMany({
    where: { assetId },
    include: {
      warrantyType: true,
      asset: true,
      notifications: true,
    },
  });
};

//create warranty
export const createWarranty = async (warranty: Omit<Warranties, 'warrantyId' | 'createdAt' | 'updatedAt'>) => {
  const warrantyData: any = { ...warranty };
  
  // Only add dates if they exist and are valid
  if (warranty.startDate) {
    warrantyData.startDate = new Date(warranty.startDate);
  }
  
  if (warranty.endDate) {
    warrantyData.endDate = new Date(warranty.endDate);
  }
  
  return await prisma.warranties.create({
    data: warrantyData,
    include: {
      warrantyType: true,
      asset: true,
      notifications: true,
    },
  });
};

//update warranty
export const updateWarranty = async (id: number, warranty: Partial<Warranties>) => {
  return await prisma.warranties.update({
    where: { warrantyId: id },
    data: {
      ...warranty,
      startDate: new Date(warranty.startDate!),
      endDate: new Date(warranty.endDate!),
    },
    include: {
      warrantyType: true,
      asset: true,
      notifications: true,
    },
  });
};

//delete warranty
export const deleteWarranty = async (id: number) => {
  return await prisma.warranties.delete({
    where: { warrantyId: id },
  });
};

//get warranty types
export const getAllWarrantyTypes = async (supplierId?: string, consumerId?: string) => {
  return await prisma.warrantyType.findMany({
    where: {
      ...(supplierId && { supplierId }),
      ...(consumerId && { consumerId }),
    },
  });
};

//get warranty type by id
export const getWarrantyTypeById = async (id: number) => {
  return await prisma.warrantyType.findUnique({
    where: { warrantyTypeId: id },
    include: {
      warranties: true,
    },
  });
};

//create warranty type
export const createWarrantyType = async (warrantyType: { typeName: string; description?: string, consumerId?: string, supplierId?: string }) => {
  return await prisma.warrantyType.create({
    data: warrantyType,
  });
};

//update warranty type
export const updateWarrantyType = async (id: number, warrantyType: { typeName?: string; description?: string }) => {
  return await prisma.warrantyType.update({
    where: { warrantyTypeId: id },
    data: warrantyType,
  });
};

//delete warranty type
export const deleteWarrantyType = async (id: number) => {
  return await prisma.warrantyType.delete({
    where: { warrantyTypeId: id },
  });
};

//get warranty stats based on expiring soon and recently expired warranties
export const getWarrantyStats = async (consumerId: string) => {
  // Normalize current date to start of day (remove time component)
  const today = new Date();
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Calculate dates for expiring soon (future dates) - normalize to start of day
  const expiringIn5Days = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  const expiringIn10Days = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);
  const expiringIn30Days = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  // Calculate dates for recently expired (past dates) - normalize to start of day
  const expired5DaysAgo = new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000);
  const expired10DaysAgo = new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000);
  const expired30DaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get all warranties without AMC/CMC for this consumer
  const warrantiesWithoutAmcCmc = await getWarrantiesWithoutAmcCMc(consumerId);
  console.log("expiringIn5Days", expiringIn5Days);
  console.log("expiringIn10Days", expiringIn10Days);
  console.log("expiringIn30Days", expiringIn30Days);
  console.log("expired5DaysAgo", expired5DaysAgo);
  console.log("expired10DaysAgo", expired10DaysAgo);
  console.log("expired30DaysAgo", expired30DaysAgo);
  //console.log("warrantiesWithoutAmcCmc", warrantiesWithoutAmcCmc);
  // Filter warranties by date ranges for expiring soon
  const expiringIn5DaysWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate > currentDate && w.endDate <= expiringIn5Days && w.isActive
  );
  
  const expiringIn10DaysWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate > expiringIn5Days && w.endDate <= expiringIn10Days && w.isActive
  );
  
  const expiringIn30DaysWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate > expiringIn10Days && w.endDate <= expiringIn30Days && w.isActive
  );

  // Filter warranties by date ranges for recently expired
  const expired5DaysAgoWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate >= expired5DaysAgo && w.endDate <= currentDate && w.isActive
  );
  
  const expired10DaysAgoWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate >= expired10DaysAgo && w.endDate <= currentDate && w.isActive
  );
  
  const expired30DaysAgoWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate >= expired30DaysAgo && w.endDate <= currentDate && w.isActive
  );

  // Get total count of warranties without AMC/CMC
  const totalWarrantiesWithoutAmcCmc = warrantiesWithoutAmcCmc.length;
  //debugWarrantyStats(consumerId);
  return {
    totalWarrantiesWithoutAmcCmc,
    expiringSoon: {
      in5Days: {title: WARRANTY_STATS_TEXT.expiringSoon.title, count: expiringIn5DaysWarranties.length, text: WARRANTY_STATS_TEXT.expiringSoon.in5Days},
      in10Days: {title: WARRANTY_STATS_TEXT.expiringSoon.title, count: expiringIn10DaysWarranties.length, text: WARRANTY_STATS_TEXT.expiringSoon.in10Days},
      in30Days: {title: WARRANTY_STATS_TEXT.expiringSoon.title, count: expiringIn30DaysWarranties.length, text: WARRANTY_STATS_TEXT.expiringSoon.in30Days}
    },
    recentlyExpired: {
      inLast5Days: {title: WARRANTY_STATS_TEXT.recentlyExpired.title, count: expired5DaysAgoWarranties.length, text: WARRANTY_STATS_TEXT.recentlyExpired.inLast5Days},
      inLast10Days: {title: WARRANTY_STATS_TEXT.recentlyExpired.title, count: expired10DaysAgoWarranties.length, text: WARRANTY_STATS_TEXT.recentlyExpired.inLast10Days},
      inLast30Days: {title: WARRANTY_STATS_TEXT.recentlyExpired.title, count: expired30DaysAgoWarranties.length, text: WARRANTY_STATS_TEXT.recentlyExpired.inLast30Days}
    }
  };
};


//fetch all warranty data which have no assetId in contractService
export const getWarrantiesWithoutAmcCMc = async (consumerId?: string, filter?: { type: typeof FILTER_TYPES.expiring | typeof FILTER_TYPES.expired; days: number }) => {
  // First, get all assetIds that have service contracts
  const assetsWithServiceContracts = await prisma.serviceContract.findMany({
    select: {
      assetId: true
    },
    distinct: ['assetId']
  });
  
  const assetIdsWithServiceContracts = assetsWithServiceContracts
    .map(contract => contract.assetId)
    .filter(assetId => assetId !== null) as string[];
  
  // Calculate date filters if provided
  let dateFilter: any = {};
  if (filter) {
    const today = new Date();
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    if (filter.type === FILTER_TYPES.expiring) {
      // For expiring warranties, check if they expire within the specified days
      const futureDate = new Date(currentDate.getTime() + filter.days * 24 * 60 * 60 * 1000);
      dateFilter = {
        endDate: {
          gte: currentDate,
          lte: futureDate
        }
      };
    } else if (filter.type === FILTER_TYPES.expired) {
      // For expired warranties, check if they expired within the specified days
      const pastDate = new Date(currentDate.getTime() - filter.days * 24 * 60 * 60 * 1000);
      dateFilter = {
        endDate: {
          gte: pastDate,
          lt: currentDate
        }
      };
    }
  }

  // Then, get all warranties that don't have assetId in service contracts
  const warranties = await prisma.warranties.findMany({
    where: {
      ...(consumerId && { consumerId }),
      // Warranties with assetId that doesn't exist in service contracts
      assetId: {
        notIn: assetIdsWithServiceContracts
      },
      // Add conditions for warrantyNotApplicable and amcCmcNotApplicable to be 0
      asset: {
        warrantyNotApplicable: false,
        amcCmcNotApplicable: false
      },
      // Add date filter if provided
      ...dateFilter,
      // Only include active warranties
      isActive: true
    },
    include: {
      warrantyType: true,
      asset: {
        select: {
          id: true,
          assetName: true,
          consumerId: true,
          status: true,
          warrantyNotApplicable: true,
          amcCmcNotApplicable: true
        }
      },
      notifications: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return warranties;
};

// Debug function to verify warranty statistics with raw queries Testing purpose only
export const debugWarrantyStats = async (consumerId: string) => {
  // Normalize current date to start of day (remove time component)
  const today = new Date();
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Calculate dates for expiring soon (future dates) - normalize to start of day
  const expiringIn5Days = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  const expiringIn10Days = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);
  const expiringIn30Days = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  // Calculate dates for recently expired (past dates) - normalize to start of day
  const expired5DaysAgo = new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000);
  const expired10DaysAgo = new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000);
  const expired30DaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  console.log("=== DEBUG WARRANTY STATS ===");
  console.log("Current Date:", currentDate.toISOString());
  console.log("Expiring in 5 days:", expiringIn5Days.toISOString());
  console.log("Expiring in 10 days:", expiringIn10Days.toISOString());
  console.log("Expiring in 30 days:", expiringIn30Days.toISOString());
  console.log("Expired 5 days ago:", expired5DaysAgo.toISOString());
  console.log("Expired 10 days ago:", expired10DaysAgo.toISOString());
  console.log("Expired 30 days ago:", expired30DaysAgo.toISOString());

  // Get all warranties without AMC/CMC for this consumer
  const warrantiesWithoutAmcCmc = await getWarrantiesWithoutAmcCMc(consumerId);
  console.log("Total warranties without AMC/CMC:", warrantiesWithoutAmcCmc.length);

  // Debug: Show all warranty end dates
  console.log("=== WARRANTY END DATES ===");
  warrantiesWithoutAmcCmc.forEach((warranty, index) => {
    console.log(`Warranty ${index + 1}:`, {
      warrantyId: warranty.warrantyId,
      assetId: warranty.assetId,
      endDate: warranty.endDate?.toISOString(),
      isActive: warranty.isActive,
      assetName: warranty.asset?.assetName
    });
  });

  // Debug: Filter warranties by date ranges for expiring soon
  const expiringIn5DaysWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate > currentDate && w.endDate <= expiringIn5Days && w.isActive
  );
  
  const expiringIn10DaysWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate > expiringIn5Days && w.endDate <= expiringIn10Days && w.isActive
  );
  
  const expiringIn30DaysWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate > expiringIn10Days && w.endDate <= expiringIn30Days && w.isActive
  );

  console.log("=== EXPIRING SOON DEBUG ===");
  console.log("Expiring in 5 days:", expiringIn5DaysWarranties.length);
  expiringIn5DaysWarranties.forEach(w => {
    console.log(`  - Warranty ID: ${w.warrantyId}, End Date: ${w.endDate?.toISOString()}, Asset: ${w.asset?.assetName}`);
  });

  console.log("Expiring in 10 days:", expiringIn10DaysWarranties.length);
  expiringIn10DaysWarranties.forEach(w => {
    console.log(`  - Warranty ID: ${w.warrantyId}, End Date: ${w.endDate?.toISOString()}, Asset: ${w.asset?.assetName}`);
  });

  console.log("Expiring in 30 days:", expiringIn30DaysWarranties.length);
  expiringIn30DaysWarranties.forEach(w => {
    console.log(`  - Warranty ID: ${w.warrantyId}, End Date: ${w.endDate?.toISOString()}, Asset: ${w.asset?.assetName}`);
  });

  // Debug: Filter warranties by date ranges for recently expired
  const expired5DaysAgoWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate >= expired5DaysAgo && w.endDate <= currentDate && w.isActive
  );
  
  const expired10DaysAgoWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate >= expired10DaysAgo && w.endDate <= currentDate && w.isActive
  );
  
  const expired30DaysAgoWarranties = warrantiesWithoutAmcCmc.filter(w => 
    w.endDate && w.endDate >= expired30DaysAgo && w.endDate <= currentDate && w.isActive
  );

  console.log("=== RECENTLY EXPIRED DEBUG ===");
  console.log("Expired in last 5 days:", expired5DaysAgoWarranties.length);
  expired5DaysAgoWarranties.forEach(w => {
    console.log(`  - Warranty ID: ${w.warrantyId}, End Date: ${w.endDate?.toISOString()}, Asset: ${w.asset?.assetName}`);
  });

  console.log("Expired in last 10 days:", expired10DaysAgoWarranties.length);
  expired10DaysAgoWarranties.forEach(w => {
    console.log(`  - Warranty ID: ${w.warrantyId}, End Date: ${w.endDate?.toISOString()}, Asset: ${w.asset?.assetName}`);
  });

  console.log("Expired in last 30 days:", expired30DaysAgoWarranties.length);
  expired30DaysAgoWarranties.forEach(w => {
    console.log(`  - Warranty ID: ${w.warrantyId}, End Date: ${w.endDate?.toISOString()}, Asset: ${w.asset?.assetName}`);
  });

  return {
    totalWarrantiesWithoutAmcCmc: warrantiesWithoutAmcCmc.length,
    expiringSoon: {
      in5Days: expiringIn5DaysWarranties.length,
      in10Days: expiringIn10DaysWarranties.length,
      in30Days: expiringIn30DaysWarranties.length
    },
    recentlyExpired: {
      inLast5Days: expired5DaysAgoWarranties.length,
      inLast10Days: expired10DaysAgoWarranties.length,
      inLast30Days: expired30DaysAgoWarranties.length
    }
  };
};



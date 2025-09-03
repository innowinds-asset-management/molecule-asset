//fetch all warranties
import { Warranties, PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const getAllWarranties = async (consumerId?: string) => {
  return await prisma.warranties.findMany({
    where: {
      ...(consumerId && { consumerId }),
    }, include: {
      warrantyType: true,
      asset: true,
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
  const currentDate = new Date();
  
  // Calculate dates for expiring soon (future dates)
  const expiringIn5Days = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  const expiringIn10Days = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);
  const expiringIn30Days = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  // Calculate dates for recently expired (past dates)
  const expired5DaysAgo = new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000);
  const expired10DaysAgo = new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000);
  const expired30DaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get counts for expiring soon warranties
  const expiringIn5DaysCount = await prisma.warranties.count({
    where: {
      consumerId,
      endDate: {
        gte: currentDate,
        lte: expiringIn5Days
      },
      isActive: true
    }
  });

  const expiringIn10DaysCount = await prisma.warranties.count({
    where: {
      consumerId,
      endDate: {
        gte: currentDate,
        lte: expiringIn10Days
      },
      isActive: true
    }
  });

  const expiringIn30DaysCount = await prisma.warranties.count({
    where: {
      consumerId,
      endDate: {
        gte: currentDate,
        lte: expiringIn30Days
      },
      isActive: true
    }
  });

  // Get counts for recently expired warranties
  const expired5DaysAgoCount = await prisma.warranties.count({
    where: {
      consumerId,
      endDate: {
        gte: expired5DaysAgo,
        lte: currentDate
      },
      isActive: true
    }
  });

  const expired10DaysAgoCount = await prisma.warranties.count({
    where: {
      consumerId,
      endDate: {
        gte: expired10DaysAgo,
        lte: currentDate
      },
      isActive: true
    }
  });

  const expired30DaysAgoCount = await prisma.warranties.count({
    where: {
      consumerId,
      endDate: {
        gte: expired30DaysAgo,
        lte: currentDate
      },
      isActive: true
    }
  });

  return {
    expiringSoon: {
      in5Days: expiringIn5DaysCount,
      in10Days: expiringIn10DaysCount,
      in30Days: expiringIn30DaysCount
    },
    recentlyExpired: {
      inLast5Days: expired5DaysAgoCount,
      inLast10Days: expired10DaysAgoCount,
      inLast30Days: expired30DaysAgoCount
    }
  };
};




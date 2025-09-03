//fetch all assets
import { PrismaClient, InstallationStatus } from '@prisma/client';
import { CreateAssetFromGrnAndPoLineItemInput, CreateAssetWithWarrantyInput } from '../types';
import { ASSET_STATUS_GROUPS, ASSET_STATUS_ARRAYS, ASSET_STATUSES } from '../utils/constants';

const prisma = new PrismaClient();

export const getAllAssets = async (consumerId:string,params?: { consumerId?: string; supplierId?: string; departmentId?: string;status?: string }) => {
  const where: any = {};  
    where.consumerId = consumerId;
  
  
  if (params && typeof params.supplierId !== 'undefined' && params.supplierId !== null) { 
    where.supplierId = params.supplierId;
  }
  
  if (params && typeof params.departmentId !== 'undefined' && params.departmentId !== null) { 
    where.departmentId = params.departmentId;
  }

  if (params && typeof params.status !== 'undefined' && params.status !== null) { 
    if (params.status === ASSET_STATUS_GROUPS.PRE_ACTIVE) {
      // Received group contains: installation_pending, retired, installed     
      where.AND = [
        {
          status: {
            in: ASSET_STATUS_ARRAYS.PRE_ACTIVE_STATUSES
          }
        },
        {
          status: {
            not: null
          }
        }
      ];      
    } else if (params.status === ASSET_STATUS_GROUPS.ACTIVE) {
      where.status = params.status;
    } else if (params.status === ASSET_STATUS_GROUPS.RETIRED) {
      where.status = params.status;
    }else if (params.status === ASSET_STATUS_GROUPS.ACTIVE_OR_PRE_ACTIVE) {
      where.AND = [
        {
          status: {
            in: ASSET_STATUS_ARRAYS.ACTIVE_OR_PRE_ACTIVE_STATUSES
          }
        },
        {
          status: {
            not: null
          }
        }
      ];   
    }
  }
  
  const assets = await prisma.asset.findMany({
    where,
    include: {
      supplier: true,
      department: true,
      assetType: true,
      assetSubType: true,
      assetCondition: true,
      serviceContracts: {
        select: {
          contractId: true,
          contractNumber: true,
          contractName: true,
          startDate: true,
          endDate: true,
        }
      },
      warranties: {
        select: {
          assetId: true,
          startDate: true,
          endDate: true
        }
      },
      locations: true,
      installations: true,
      assetStatus:true
      
    },
    orderBy: {
      createdAt: 'desc'
    },
  });
  return assets;
};

//fetch asset by id 
export const getAssetById = async (id: string) => {
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      locations: true,   
      installations: true,
      department: true,
      assetType: true,
      assetSubType: true,
      supplier: true,
      //consumer: true,
      warranties: {
        include: {
          warrantyType: true
        }
      },
      serviceRequests: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      },
      serviceContracts: true,
      assetCondition: true,      
    },
  });

  if (asset) {
    // Get the current location (most recent or marked as current)
    const currentLocation = asset.locations?.find(loc => loc.isCurrentLocation) || 
                           asset.locations?.[0]; // Fallback to first location if no current

    // Flatten location fields to the asset object for easier frontend consumption
    if (currentLocation) {
      (asset as any).building = currentLocation.building;
      (asset as any).floorNumber = currentLocation.floorNumber;
      (asset as any).roomNumber = currentLocation.roomNumber;
    }
  }

  return asset;
};


//update asset
export const updateAsset = async (id: string, assetData: any) => {
  // Extract location-related fields
  const { building, floorNumber, roomNumber, ...assetFields } = assetData;

  console.log('department',assetFields.departmentId)

  if(assetFields.installationDate)
    assetFields.installationDate = new Date(assetFields.installationDate);
  
  // Start a transaction to update both asset and location
  return await prisma.$transaction(async (tx) => {
    // 1. Update the asset
    const updatedAsset = await tx.asset.update({
      where: { id },      
      data: assetFields,
    });

    // 2. Handle location updates if location fields are provided
    if (building || floorNumber || roomNumber  || assetFields.departmentId) {
      // Check if location already exists for this asset
      const existingLocation = await tx.location.findFirst({
        where: { 
          assetId: id,
          isCurrentLocation: true 
        }
      });

      if (existingLocation) {
        // Update existing location
        await tx.location.update({
          where: { id: existingLocation.id },
          data: {
            ...(building   && { building }),
            ...(floorNumber   && { floorNumber }),
            ...(roomNumber  && { roomNumber }),
            ...(assetFields.departmentId && { departmentId:assetFields.departmentId }),

            updatedAt: new Date()
          }
        });
      } else {
        // Create new location if it doesn't exist
        await tx.location.create({
          data: {
            assetId: id,
            departmentId: assetFields.departmentId || '',
            building: building || '',
            floorNumber: floorNumber || '',
            roomNumber: roomNumber || '',
            isCurrentLocation: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    }

    return updatedAsset;
  });
};

//delete asset
export const deleteAsset = async (id: string) => {
  return await prisma.asset.delete({
    where: { id },
  });
};  

/**
 * Create asset with warranty, location, and installation in a single transaction.
 * Handles the new request structure with separate asset and warranty objects.
 */
export const createAssetWithWarranty = async (data: CreateAssetWithWarrantyInput) => {
  // Start database transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create asset
    const assetData = {
      assetTypeId: data.asset.assetTypeId,
      assetSubTypeId: data.asset.assetSubTypeId,
      assetName: data.asset.assetName,
      consumerId: data.asset.consumerId,
      status: ASSET_STATUSES.RECEIVED,
      ...(data.asset.installationDate && { installationDate: new Date(data.asset.installationDate) }),
      ...(data.asset.brand && { brand: data.asset.brand }),
      ...(data.asset.model && { model: data.asset.model }),
      ...(data.asset.subModel && { subModel: data.asset.subModel }),
      ...(data.asset.isActive !== undefined && { isActive: data.asset.isActive }),
      ...(data.asset.partNo && { partNo: data.asset.partNo }),
      ...(data.asset.supplierCode && { supplierCode: data.asset.supplierCode }),
      ...(data.asset.consumerSerialNo && { consumerSerialNo: data.asset.consumerSerialNo }),
      ...(data.asset.grnId && { grnId: data.asset.grnId }),
      ...(data.asset.grnItemId && { grnItemId: data.asset.grnItemId }),
      ...(data.asset.poLineItemId && { poLineItemId: data.asset.poLineItemId }),
      ...(data.asset.supplierId && { supplierId: data.asset.supplierId }),
      ...(data.asset.isAmc !== undefined && { isAmc: data.asset.isAmc }),
      ...(data.asset.supplierSerialNo && { supplierSerialNo: data.asset.supplierSerialNo }),
      ...(data.asset.departmentId && { departmentId: data.asset.departmentId })
    };

    const createdAsset = await tx.asset.create({
      data: assetData
    });

    // 2. Create location if location data is provided
    let createdLocation = null;
    if (data.asset.departmentId || (data.asset.building && data.asset.building.trim() !== '') || (data.asset.floorNumber && data.asset.floorNumber.trim() !== '') || (data.asset.roomNumber && data.asset.roomNumber.trim() !== '')) {
      const locationData = {
        assetId: createdAsset.id,
        departmentId: data.asset.departmentId || '',
        building: data.asset.building && data.asset.building.trim() !== '' ? data.asset.building : '',
        floorNumber: data.asset.floorNumber && data.asset.floorNumber.trim() !== '' ? data.asset.floorNumber : '',
        roomNumber: data.asset.roomNumber && data.asset.roomNumber.trim() !== '' ? data.asset.roomNumber : '',
        isCurrentLocation: data.asset.isCurrentLocation || false
      };

      createdLocation = await tx.location.create({
        data: locationData
      });
    }

    // 3. Create installation if location was created
    let createdInstallation = null;
    if (createdLocation) {
      const installationData = {
        assetId: createdAsset.id,
        locationId: createdLocation.id,
        departmentId: data.asset.departmentId || '',
        installationStatus: (data.asset.installStatus && data.asset.installStatus.trim() !== '') ? (data.asset.installStatus as InstallationStatus) : 'Installed',
        installationDate: data.asset.installationDate && data.asset.installationDate.trim() !== '' ? new Date(data.asset.installationDate) : new Date()
      };

      createdInstallation = await tx.installation.create({
        data: installationData
      });
    }

    // 4. Create warranty if warranty data is provided and has required fields
    let createdWarranty = null;
    if (data.warranty) {
      const warrantyData: any = {
        assetId: createdAsset.id,
        warrantyTypeId: data.warranty.warrantyTypeId || 1, // Use provided warranty type or default to 1
        warrantyNumber: "WR-"+ Date.now(),
        cost: 0,
      };

      // Only add dates if they're valid and not empty
      if (data.warranty.startDate && data.warranty.startDate.toString().trim() !== '') {
        const startDate = new Date(data.warranty.startDate);
        if (!isNaN(startDate.getTime())) {
          warrantyData.startDate = startDate;
        }
      }
      
      if (data.warranty.endDate && data.warranty.endDate.toString().trim() !== '') {
        const endDate = new Date(data.warranty.endDate);
        if (!isNaN(endDate.getTime())) {
          warrantyData.endDate = endDate;
        }
      }

      // Add other optional warranty fields
      if (data.warranty.warrantyPeriod) {
        warrantyData.warrantyPeriod = typeof data.warranty.warrantyPeriod === 'string' ? parseInt(data.warranty.warrantyPeriod) : data.warranty.warrantyPeriod;
      }
      
      if (data.warranty.coverageType && data.warranty.coverageType.trim() !== '') {
        warrantyData.coverageType = data.warranty.coverageType;
      }
      
      if (data.warranty.coverageDescription && data.warranty.coverageDescription.trim() !== '') {
        warrantyData.coverageDescription = data.warranty.coverageDescription;
      }
      
      if (data.warranty.termsConditions && data.warranty.termsConditions.trim() !== '') {
        warrantyData.termsConditions = data.warranty.termsConditions;
      }
      
      if (data.warranty.included && data.warranty.included.toString().trim() !== '') {
        warrantyData.included = data.warranty.included.toString();
      }
      
      if (data.warranty.excluded && data.warranty.excluded.toString().trim() !== '') {
        warrantyData.excluded = data.warranty.excluded.toString();
      }
      
      if (data.warranty.isActive !== undefined) {
        warrantyData.isActive = data.warranty.isActive;
      }
      
      if (data.warranty.autoRenewal !== undefined) {
        warrantyData.autoRenewal = data.warranty.autoRenewal;
      }
      
      if (data.warranty.consumerId) {
        warrantyData.consumerId = typeof data.warranty.consumerId === 'string' ? data.warranty.consumerId : data.warranty.consumerId.toString();
      }
      
      if (data.warranty.supplierId) {
        warrantyData.supplierId = typeof data.warranty.supplierId === 'string' ? data.warranty.supplierId : data.warranty.supplierId.toString();
      }

      createdWarranty = await tx.warranties.create({
        data: warrantyData
      });
    }

    return {
      asset: createdAsset,
      location: createdLocation,
      installation: createdInstallation,
      warranty: createdWarranty
    };
  });

  return result;
};

export const createAssetFromGrnAndPoLineItemWithSerial = async (data: CreateAssetFromGrnAndPoLineItemInput & { 
  baseSerialNo?: string;
  serialNumbers?: string[];
  consumerSerialNoArray?: string[];
  warranty?: any;
}) => {
  // Validate required fields
  const requiredFields = [
    'assetSubType', 'assetType', 'consumerId', 'grnId', 'grnItemId',
    'assetName', 'partNo', 'poId', 'poLineItemId', 'qtyAccepted', 'supplierId'
  ];
  for (const field of requiredFields) {
    if (!data[field as keyof CreateAssetFromGrnAndPoLineItemInput]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate serial numbers if provided
  if (data.serialNumbers && data.serialNumbers.length !== data.qtyAccepted) {
    throw new Error(`Serial numbers count (${data.serialNumbers.length}) must match accepted quantity (${data.qtyAccepted})`);
  }

  // Validate consumerSerialNoArray if provided and not empty - allow partial arrays
  if (data.consumerSerialNoArray && data.consumerSerialNoArray.length > data.qtyAccepted) {
    throw new Error(`Consumer serial number array count (${data.consumerSerialNoArray.length}) cannot exceed accepted quantity (${data.qtyAccepted})`);
  }

  // Generate consumerSerialNo for each asset
  const now = Date.now();
  const assetsToCreate = Array.from({ length: data.qtyAccepted }).map((_, idx) => {
    let consumerSerialNo: string | undefined;
    
    // Priority: consumerSerialNoArray > serialNumbers > baseSerialNo > auto-generate
    if (data.consumerSerialNoArray && data.consumerSerialNoArray.length > 0 && idx < data.consumerSerialNoArray.length && data.consumerSerialNoArray[idx] && data.consumerSerialNoArray[idx].trim() !== '') {
      // Use provided serial number from consumerSerialNoArray
      consumerSerialNo = data.consumerSerialNoArray[idx];
    } else if (data.serialNumbers && data.serialNumbers[idx]) {
      // Use provided serial number from serialNumbers
      consumerSerialNo = data.serialNumbers[idx];
    } else if (data.baseSerialNo) {
      // Generate from base serial number
      consumerSerialNo = `${data.baseSerialNo}-${idx + 1}`;
    } else {
      // Generate auto serial number
      consumerSerialNo = `${data.assetName}-${now}-${idx + 1}`;
    }
    
    return {
      assetSubTypeId: data.assetSubType,
      status: ASSET_STATUSES.RECEIVED,
      assetTypeId: data.assetType,
      consumerId: data.consumerId,
      grnId: data.grnId,
      grnItemId: data.grnItemId,
      assetName: data.assetName,
      partNo: data.partNo,
      poLineItemId: data.poLineItemId,
      supplierId: data.supplierId,
      isActive: true,
      consumerSerialNo
    };
  });

  // Use transaction to create assets and warranties
  const result = await prisma.$transaction(async (tx) => {
    // Create assets in batch
    const createResult = await tx.asset.createMany({
      data: assetsToCreate,
      skipDuplicates: false
    });

    // If warranty data is provided, create warranties for each asset
    let warranties = [];
    if (data.warranty) {
      // Get the created assets to create warranties
      const createdAssets = await tx.asset.findMany({
        where: {
          assetName: data.assetName,
          status: ASSET_STATUSES.RECEIVED,
          partNo: data.partNo,
          consumerId: data.consumerId,
          supplierId: data.supplierId
        },
        orderBy: { createdAt: 'desc' },
        take: data.qtyAccepted
      });

      // Create warranty for each asset
      for (const asset of createdAssets) {
        // Check if warranty has required fields
        if (data.warranty.startDate && new Date(data.warranty.endDate) > new Date()) {
          const warrantyData = {
            assetId: asset.id,
            warrantyTypeId: data.warranty.warrantyTypeId, 
            startDate: new Date(data.warranty.startDate),
            endDate: new Date(data.warranty.endDate),
            warrantyNumber: "WR-"+ Date.now() + Math.floor(Math.random() * 1000),
            cost: 0,
            ...(data.warranty.warrantyPeriod && { warrantyPeriod: typeof data.warranty.warrantyPeriod === 'string' ? parseInt(data.warranty.warrantyPeriod) : data.warranty.warrantyPeriod }),
            ...(data.warranty.coverageType && { coverageType: data.warranty.coverageType }),
            ...(data.warranty.coverageDescription && { coverageDescription: data.warranty.coverageDescription }),
            ...(data.warranty.termsConditions && { termsConditions: data.warranty.termsConditions }),
            ...(data.warranty.included && { included: data.warranty.included.toString() }),
            ...(data.warranty.excluded && { excluded: data.warranty.excluded.toString() }),
            ...(data.warranty.isActive !== undefined && { isActive: data.warranty.isActive }),
            ...(data.warranty.autoRenewal !== undefined && { autoRenewal: data.warranty.autoRenewal }),
            ...(data.warranty.consumerId && { consumerId: typeof data.warranty.consumerId === 'string' ? data.warranty.consumerId : data.warranty.consumerId.toString() }),
            ...(data.warranty.supplierId && { supplierId: typeof data.warranty.supplierId === 'string' ? data.warranty.supplierId : data.warranty.supplierId.toString() })
          };
          const warranty = await tx.warranties.create({
            data: warrantyData
          });
          warranties.push(warranty);
        }
      }
    }

    return {
      count: createResult.count,
      message: `Successfully created ${createResult.count} assets${data.warranty ? ` and ${warranties.length} warranties` : ''}`,
      assetName: data.assetName,
      partNo: data.partNo,
      qtyAccepted: data.qtyAccepted,
      warranties: warranties
    };
  });

  return result;
};
  
//fecth asset count based on status active , retired and pre-active - contains['installation_pending', 'received', 'installed']
export const getAssetCountByStatus = async (consumerId:string) => {
  try {
    // Count active assets
    const activeCount = await prisma.asset.count({
      where: {
        AND: [
          {
            status: ASSET_STATUSES.ACTIVE
          },
          {
            status: {
              not: null
            }
          },
          {
            consumerId
          }
        ]
      }
    });

    // Count retired assets
    const retiredCount = await prisma.asset.count({
      where: {
        AND: [
          {
            status: ASSET_STATUSES.RETIRED
          },
          {
            status: {
              not: null
            }
          },
          {
            consumerId

          }
        ]
      }
    });

    // Count pre-active assets (installation_pending, received, installed)
    const preActiveCount = await prisma.asset.count({
      where: {
        AND: [
          {
            status: {
              in: ASSET_STATUS_ARRAYS.PRE_ACTIVE_STATUSES
            }
          },
          {
            status: {
              not: null
            }
          },
          {
            consumerId

          }
        ]
      }
    });

    return {
      active: activeCount,
      retired: retiredCount,
      preActive: preActiveCount,
    };
  } catch (error) {
    console.error('Error fetching asset counts by status:', error);
    throw new Error('Failed to fetch asset counts by status');
  }
};

// Update asset and warranty based on assetId and consumerId
export const updateAssetWarranty = async (assetId: string, consumerId: string, data: {
  asset: {
    assetId: string;
    status?: string;
    departmentId?: string;
    consumerId: string;
    assetAssignTo?: string;
  };
  warranty: {
    warrantyTypeId: number;
    startDate: string;
    endDate: string;
    warrantyPeriod: number;
    coverageType: string;
    consumerId: string;
  };
}) => {
  return await prisma.$transaction(async (tx) => {
    // Validate that the asset exists and belongs to the consumer
    const existingAsset = await tx.asset.findFirst({
      where: {
        id: assetId,
        consumerId: consumerId
      }
    });

    if (!existingAsset) {
      throw new Error(`Asset with ID ${assetId} not found for consumer ${consumerId}`);
    }

    // Update asset
    const assetUpdateData: any = {
      updatedAt: new Date()
    };

    // Only include fields that are provided
    if (data.asset.status !== undefined) {
      assetUpdateData.status = data.asset.status;
    }
    if (data.asset.departmentId !== undefined) {
      assetUpdateData.departmentId = data.asset.departmentId;
      // Check if location already exists for this asset
      const existingLocation = await tx.location.findFirst({
        where: { 
          assetId,
          isCurrentLocation: true 
        }
      });

      if (existingLocation) {
        // Update existing location
        await tx.location.update({
          where: { id: existingLocation.id },
          data: {
            departmentId:data.asset.departmentId,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new location if it doesn't exist
        await tx.location.create({
          data: {
            assetId,
            departmentId: data.asset.departmentId,
            isCurrentLocation: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    }

    
    if (data.asset.assetAssignTo !== undefined) {
      assetUpdateData.assetAssignTo = data.asset.assetAssignTo;
    }

    const updatedAsset = await tx.asset.update({
      where: { 
        id: assetId 
      },
      data: assetUpdateData
    });

    // Check if warranty already exists for this asset
    const existingWarranty = await tx.warranties.findFirst({
      where: {
        assetId: assetId
      }
    });

    let updatedWarranty;

    if (existingWarranty) {
      // Update existing warranty
      updatedWarranty = await tx.warranties.update({
        where: {
          warrantyId: existingWarranty.warrantyId
        },
        data: {
          warrantyTypeId: data.warranty.warrantyTypeId,
          startDate: new Date(data.warranty.startDate),
          endDate: new Date(data.warranty.endDate),
          warrantyPeriod: data.warranty.warrantyPeriod,
          coverageType: data.warranty.coverageType,
          consumerId: data.warranty.consumerId,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new warranty
      updatedWarranty = await tx.warranties.create({
        data: {
          assetId: assetId,
          warrantyTypeId: data.warranty.warrantyTypeId,
          startDate: new Date(data.warranty.startDate),
          endDate: new Date(data.warranty.endDate),
          warrantyPeriod: data.warranty.warrantyPeriod,
          coverageType: data.warranty.coverageType,
          consumerId: data.warranty.consumerId,
          warrantyNumber: `WR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          isActive: true,
          autoRenewal: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    return {
      success: true,
      message: 'Asset and warranty updated successfully',
      asset: updatedAsset,
      warranty: updatedWarranty
    };
  });
};


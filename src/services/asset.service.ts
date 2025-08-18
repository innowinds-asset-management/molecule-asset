//fetch all assets
import { Asset, PrismaClient } from '@prisma/client';
import { CreateAssetFromGrnAndPoLineItemInput, CreateAssetWithWarrantyInput } from '../types';

const prisma = new PrismaClient();

export const getAllAssets = async (params?: { consumerId?: string; supplierId?: string; departmentId?: string }) => {
  const where: any = {};
  
  if (params?.consumerId) {
    where.consumerId = params.consumerId;
  }
  
  if (params?.supplierId) {
    where.supplierId = params.supplierId;
  }
  
  if (params?.departmentId) {
    where.departmentId = params.departmentId;
  }
  
  return await prisma.asset.findMany({
    where,
    include: {
      supplier: true,
      department: true,
      assetType: true,
      assetSubType: true,
      locations: true,
      installations: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
  });
};

//fetch asset by id 
export const getAssetById = async (id: string) => {
  return await prisma.asset.findUnique({
    where: { id },
    include: {
      locations: true,   
      installations: true,
      department: true,
      assetType: true,
      assetSubType: true,
      supplier: true,
      //consumer: true,
      warranties: true,
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
};


//update asset
export const updateAsset = async (id: string, asset: Asset) => {
  return await prisma.asset.update({
    where: { id },      
    data: asset,
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
    if (data.asset.departmentId || data.asset.building || data.asset.floorNumber || data.asset.roomNumber) {
      const locationData = {
        assetId: createdAsset.id,
        departmentId: data.asset.departmentId || '',
        building: data.asset.building || '',
        floorNumber: data.asset.floorNumber || '',
        roomNumber: data.asset.roomNumber || '',
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
        installationDate: data.asset.installationDate ? new Date(data.asset.installationDate) : new Date()
      };

      createdInstallation = await tx.installation.create({
        data: installationData
      });
    }

    // 4. Create warranty if warranty data is provided
    let createdWarranty = null;
    if (data.warranty) {
      // Ensure required fields are provided
      if (!data.warranty.startDate || !data.warranty.endDate) {
        throw new Error('Warranty startDate and endDate are required');
      }

      const warrantyData = {
        assetId: createdAsset.id,
        warrantyTypeId: 1, // Default warranty type - you might want to make this configurable
        startDate: new Date(data.warranty.startDate),
        endDate: new Date(data.warranty.endDate),
        warrantyNumber: "WR-"+ Date.now() || '',
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






      
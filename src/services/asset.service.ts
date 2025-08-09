//fetch all assets
import { Asset, PrismaClient } from '@prisma/client';
import { CreateAssetCompleteData } from '../types';

const prisma = new PrismaClient();

export const getAllAssets = async () => {
  return await prisma.asset.findMany({
    include: {
      supplier: true,
      department: true,
      assetType: true,
      assetSubType: true,
      locations: true,
      installations: true,
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
    },
  });
};

//create asset
export const createAsset = async (asset: Asset) => {    
  return await prisma.asset.create({
    data: asset,
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

//create asset complete by batch process and create location and installation in single transaction  with transacion safe
//data is an array of CreateAssetCompleteData
export const createAssetComplete = async (data: CreateAssetCompleteData[]) => {
  // Start database transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create all assets in bulk
    const assetDataArray = data.map(item => ({
      assetTypeId: item.assetTypeId,
      assetSubTypeId: item.assetSubTypeId,
      assetName: item.assetName,
      consumerId: item.consumerId,
      ...(item.warrantyPeriod !== undefined && { warrantyPeriod: item.warrantyPeriod }),
      ...(item.warrantyStartDate !== undefined && { warrantyStartDate: item.warrantyStartDate }),
      ...(item.warrantyEndDate !== undefined && { warrantyEndDate: item.warrantyEndDate }),
      ...(item.installationDate !== undefined && { installationDate: item.installationDate }),
      ...(item.brand !== undefined && { brand: item.brand }),
      ...(item.model !== undefined && { model: item.model }),
      ...(item.subModel !== undefined && { subModel: item.subModel }),
      ...(item.isActive !== undefined && { isActive: item.isActive }),
      ...(item.partNo !== undefined && { partNo: item.partNo }),
      ...(item.supplierCode !== undefined && { supplierCode: item.supplierCode }),
      ...(item.consumerSerialNo !== undefined && { consumerSerialNo: item.consumerSerialNo }),
      ...(item.grnId !== undefined && { grnId: item.grnId }),
      ...(item.grnItemId !== undefined && { grnItemId: item.grnItemId }),
      ...(item.poLineItemId !== undefined && { poLineItemId: item.poLineItemId }),
      ...(item.supplierId !== undefined && { supplierId: item.supplierId }),
      ...(item.isAmc !== undefined && { isAmc: item.isAmc }),
      ...(item.supplierSerialNo !== undefined && { supplierSerialNo: item.supplierSerialNo }),
      ...(item.departmentId !== undefined && { departmentId: item.departmentId })
    }));

    await tx.asset.createMany({
      data: assetDataArray,
      skipDuplicates: false
    });

    // 2. Get created assets with IDs
    const createdAssets = await tx.asset.findMany({
      where: {
        assetTypeId: { in: data.map(item => item.assetTypeId) },
        assetName: { in: data.map(item => item.assetName) },
        consumerId: { in: data.map(item => item.consumerId) }
      },
      orderBy: { createdAt: 'desc' },
      take: data.length
    });

    // 3. Create all locations in bulk
    const locationDataArray = createdAssets.map((asset, index) => {
      const item = data[index];
      if (!item) throw new Error(`No data found for asset at index ${index}`);
      
      return {
        assetId: asset.id,
        departmentId: item.departmentId || '',
        building: item.building || '',
        floorNumber: item.floorNumber || '',
        roomNumber: item.roomNumber || '',   
        isCurrentLocation: item.isCurrentLocation || false
      };
    });

    await tx.location.createMany({
      data: locationDataArray,
      skipDuplicates: false
    });

    // 4. Get created locations with IDs
    const createdLocations = await tx.location.findMany({
      where: {
        assetId: { in: createdAssets.map(asset => asset.id) }
      },
      orderBy: { createdAt: 'desc' },
      take: data.length
    });

    // 5. Create all installations in bulk
    const installationDataArray = createdAssets.map((asset, index) => {
      const item = data[index];
      const location = createdLocations[index];
      
      if (!item) throw new Error(`No data found for asset at index ${index}`);
      
      return {
        assetId: asset.id,
        locationId: location?.id || '',
        departmentId: item.departmentId || '',
        installationDate: item.installationDate || new Date()
      };
    });

    const installations = await tx.installation.createMany({
      data: installationDataArray,
      skipDuplicates: false
    });

    return {
      assets: createdAssets,
      locations: createdLocations,
      installations
    };
  });

  return result;
};
      
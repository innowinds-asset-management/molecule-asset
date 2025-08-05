import { PrismaClient } from '@prisma/client';
import { Location } from '../types';

const prisma = new PrismaClient();

/**
 * Fetch a location by its ID.
 * @param id - The ID of the location to fetch.
 * @returns The location object or null if not found.
 */
export const getLocationById = async (id: string): Promise<Location | null> => {
  const location = await prisma.location.findUnique({
    where: { id },
  });
  return location as Location | null;
};

/**
 * Fetch all locations.
 * @returns An array of location objects.
 */
export const getAllLocations = async (): Promise<Location[]> => {
  const locations = await prisma.location.findMany();
  return locations as Location[];
};

/**
 * Fetch locations by assetId.
 * @param assetId - The asset ID to filter locations.
 * @returns An array of location objects for the given assetId.
 */
export const getLocationsByAssetId = async (assetId: string): Promise<Location[]> => {
  const locations = await prisma.location.findMany({
    where: { assetId },
  });
  return locations as Location[];
};

/**
 * Fetch locations by departmentId.
 * @param departmentId - The department ID to filter locations.
 * @returns An array of location objects for the given departmentId.
 */
export const getLocationsByDepartmentId = async (departmentId: string): Promise<Location[]> => {
  const locations = await prisma.location.findMany({
    where: { departmentId },
  });
  return locations as Location[];
};


/**
 * Fetch a location by assetId and departmentId.
 * @param assetId - The asset ID to filter locations.
 * @param departmentId - The department ID to filter locations.
 * @returns The location object or null if not found.
 */
export const getLocationByAssetIdAndDepartmentId = async (
  assetId: string,
  departmentId: string
): Promise<Location | null> => {
  const location = await prisma.location.findFirst({
    where: {
      assetId,
      departmentId,
    },
  });
  return location as Location | null;
};

/**
 * Create a new location.
 * @param locationData - The data for the new location.
 * @returns The created location object.
 */
export const createLocation = async (locationData: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> => {
  const newLocation = await prisma.location.create({
    data: {
      ...locationData,
    },
  });
  return newLocation as Location;
};




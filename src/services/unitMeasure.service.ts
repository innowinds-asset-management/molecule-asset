import { UnitMeasure } from '@prisma/client';

export const getAllUnitMeasures = async () => {
  // Return all unit measure options from the enum
  const unitMeasures = Object.values(UnitMeasure).map(value => ({
    value,
    label: value.charAt(0) + value.slice(1).toLowerCase()
  }));
  
  return unitMeasures;
};

import { Request, Response } from 'express';
import { getAllUnitMeasures } from '../services/unitMeasure.service';

export const getAllUnitMeasuresController = async (_req: Request, res: Response) => {
  try {
    const unitMeasures = await getAllUnitMeasures();
    console.log(unitMeasures)
    return res.json(unitMeasures);
  } catch (error) {
    console.error('Error fetching unit measures:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch unit measures' 
    });
  }
};

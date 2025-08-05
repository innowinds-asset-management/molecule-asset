import { Request, Response } from "express";
import { createLocation, getAllLocations, getLocationById } from "../services/location.service";

export const getAllLocationsController = async (_req: Request, res: Response) => {
  const locations = await getAllLocations();
  return res.json(locations);
};

//fetch location by id
export const getLocationByIdController = async (req: Request, res: Response) => {   
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Location ID is required' });
    }
    const location = await getLocationById(id);
    return res.json(location);
};

//create location
export const createLocationController = async (req: Request, res: Response) => {
    const location = req.body;
    const newLocation = await createLocation(location);
    return res.json(newLocation);
};  


import { Request, Response } from 'express';
import { 
  getDepartmentInventoryByDepartmentAndInventory, 
  getDepartmentInventoryByDepartment 
} from '../services/departmentInventory.service';

export const getDepartmentInventoryByDepartmentAndInventoryController = async (req: Request, res: Response) => {
  try {
    const { departmentId, inventoryId } = req.params;

    if (!departmentId || !inventoryId) {
      return res.status(400).json({
        success: false,
        message: 'Department ID and Inventory ID are required'
      });
    }

    const departmentInventory = await getDepartmentInventoryByDepartmentAndInventory(departmentId, inventoryId);

    return res.status(200).json({
      success: true,
      data: departmentInventory
    });
  } catch (error: any) {
    console.error('Error in getDepartmentInventoryByDepartmentAndInventoryController:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const getDepartmentInventoryByDepartmentController = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: 'Department ID is required'
      });
    }

    const departmentInventory = await getDepartmentInventoryByDepartment(departmentId);

    return res.status(200).json({
      success: true,
      data: departmentInventory
    });
  } catch (error: any) {
    console.error('Error in getDepartmentInventoryByDepartmentController:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

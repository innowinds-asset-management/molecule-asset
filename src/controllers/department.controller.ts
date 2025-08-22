//fetch all departments
import { createDepartment, getAllDepartments, getDepartmentById, getDepartmentCountByConsumerId, getDepartmentsByConsumerId } from '../services/department.service';
import { Request, Response } from 'express';

export const getAllDepartmentsController = async (_req: Request, res: Response) => {
    const departments = await getAllDepartments();
    res.json(departments);
};

//fetch department by id
export const getDepartmentByIdController = async (req: Request, res: Response) => {
    const { deptId } = req.params;
    if (!deptId) {
        return res.status(400).json({ error: 'Department ID is required' });
    }
    const department = await getDepartmentById(deptId);
    return res.json(department);
};

//create department
export const createDepartmentController = async (req: Request, res: Response) => {
    const department = await createDepartment(req.body);
    res.json(department);
};

//fetch all departments by  consumer id
export const getDepartmentsByConsumerIdController = async (req: Request, res: Response) => {
    const { consumerId } = req.params;
    if (!consumerId) {
        return res.status(400).json({ error: 'Consumer ID is required' });
    }
    const departments = await getDepartmentsByConsumerId(consumerId);
    return res.json(departments);
};

//get department count by consumer id
export const getDepartmentCountByConsumerIdController = async (req: Request, res: Response) => {
    const { consumerId } = req.params;
    if (!consumerId) {
        return res.status(400).json({ error: 'Consumer ID is required' });
    }
    // Validate consumerId and fetch department count, respond in required format
    const count = await getDepartmentCountByConsumerId(consumerId);
    return res.json({
        success: true,
        data: {
            departmentCount: count
        }
    });   
};
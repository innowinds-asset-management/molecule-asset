//fetch all departments
import { createDepartment, getAllDepartments, getDepartmentById, getDepartmentCountByConsumerId, getDepartmentsByConsumerId, createDefaultDepartmentSignUp } from '../services/department.service';
import { Request, Response } from 'express';
import { AssetRequest } from '../middleware/userContextMiddleware';

export const getAllDepartmentsController = async (_req: Request, res: Response) => {
    try {
        const departments = await getAllDepartments();
        return res.json(departments);
    } catch (error) {
        console.error('Error in getAllDepartmentsController:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to fetch departments'
        });
    }
};

//fetch department by id
export const getDepartmentByIdController = async (req: Request, res: Response) => {
    try {
        const { deptId } = req.params;
        if (!deptId) {
            return res.status(400).json({ error: 'Department ID is required' });
        }
        const department = await getDepartmentById(deptId);
        return res.json(department);
    } catch (error) {
        console.error('Error in getDepartmentByIdController:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to fetch department'
        });
    }
};

//create department
export const createDepartmentController = async (req: AssetRequest, res: Response) => {
    try {
        const consumerId = req._u?.consumerId;
        console.log('consumer Id======>',consumerId)
        const department = await createDepartment(req.body,consumerId!);
        return res.json(department);
    } catch (error) {
        console.error('Error in createDepartmentController:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to create department'
        });
    }
};

//fetch all departments by  consumer id
export const getDepartmentsByConsumerIdController = async (req: AssetRequest, res: Response) => {
    try {
        const consumerId = req._u?.consumerId;
        if (!consumerId) {
            return res.status(400).json({ error: 'Consumer ID is required' });
        }
        const departments = await getDepartmentsByConsumerId(consumerId);
        return res.json(departments);
    } catch (error) {
        console.error('Error in getDepartmentsByConsumerIdController:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to fetch departments by consumer ID'
        });
    }
};

//get department count by consumer id
export const getDepartmentCountByConsumerIdController = async (req: AssetRequest, res: Response) => {
    try {
        // console.log('inside======>')

        const consumerId = req._u?.consumerId;
        // console.log('consumerId======>',consumerId)
        if (!consumerId) {
            return res.status(400).json({ error: 'Consumer ID is required' });
        }
        // Validate consumerId and fetch department count, respond in required format
        const count = await getDepartmentCountByConsumerId(consumerId);
        console.log('count',count)
        return res.json({
            success: true,
            data: {
                departmentCount: count
            }
        });  
    } catch (error) {
        console.error('Error in getDepartmentCountByConsumerIdController:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to fetch department count'
        });
    }
};

    //create default department at the time of signup
export const createDefaultDepartmentSignUpController = async (req: Request, res: Response) => {
    try {
        const department = await createDefaultDepartmentSignUp(req.body.id);
        return res.json(department);
    } catch (error) {
        console.error('Error in createDefaultDepartmentSignUpController:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to create default department'
        });
    }
};


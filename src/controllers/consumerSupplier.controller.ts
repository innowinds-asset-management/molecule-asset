//create consumer supplier

import { Request, Response } from 'express';
import { countSuppliersByConsumerId, createConsumerSupplier, getConsumerBySupplierId, getSupplierByConsumerId } from '../services/consumerSupplier';
import { AssetRequest } from '../middleware/userContextMiddleware';

export const createConsumerSupplierController = async (req: AssetRequest, res: Response) => {
    const { supplierId } = req.body;
    const consumerId = req._u?.consumerId;
    if (!consumerId || !supplierId) {
        return res.status(400).json({ error: 'consumerId and supplierId are required' });
    }
    const consumerSupplier = await createConsumerSupplier(consumerId, supplierId);
    return res.status(201).json(consumerSupplier);
};

//fetch supplier by consumer id
export const getSupplierByConsumerIdController = async (req: AssetRequest, res: Response) => {
    const consumerId = req._u?.consumerId;
    if (!consumerId) {
        return res.status(400).json({ error: 'Consumer ID is required' });
    }
    const supplier = await getSupplierByConsumerId(consumerId);
    return res.status(200).json(supplier);
};

//fetch consumer by supplier id 
export const getConsumerBySupplierIdController = async (req: Request, res: Response) => {
    const { supplierId } = req.params;
    if (!supplierId) {
        return res.status(400).json({ error: 'Supplier ID is required' });
    }
    const consumer = await getConsumerBySupplierId(supplierId);
    return res.status(200).json(consumer);
};

//count suppliers by consumer id
export const countSuppliersByConsumerIdController = async (req: AssetRequest, res: Response) => {
    const consumerId = req._u?.consumerId;
    if (!consumerId) {
        return res.status(400).json({ 
            success: false, 
            error: 'Consumer ID is required' 
        });
    }
    const count = await countSuppliersByConsumerId(consumerId);
    return res.status(200).json({
        success: true,
        data: {
            supplierCount: count
        }
    });
};
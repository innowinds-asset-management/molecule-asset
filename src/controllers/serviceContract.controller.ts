//get service contract by asset id
import { Request, Response } from 'express';
import { getServiceContractByAssetId, createServiceContract, updateServiceContract, getAllServiceContractsByServiceSupplierId, getAllServiceContracts } from "../services/serviceContract.service";

// get all service contracts
export const getAllServiceContractsController = async (_req: Request, res: Response) => {
    const serviceContracts = await getAllServiceContracts();
    return res.json(serviceContracts);
};

export const getServiceContractByAssetIdController = async (req: Request, res: Response) => {
    const assetId = req.params['assetId'];
    if (!assetId) {
        return res.status(400).json({ error: 'Asset ID is required' });
    }
    const serviceContract = await getServiceContractByAssetId(assetId);
    return res.json(serviceContract);
};

// create service contract
export const createServiceContractController = async (req: Request, res: Response) => {
    const serviceContract = req.body;
    const newServiceContract = await createServiceContract(serviceContract);
    return res.json(newServiceContract);
};

// update service contract
export const updateServiceContractController = async (req: Request, res: Response) => {
    const contractId = req.params['contractId'];
    if (!contractId) {
        return res.status(400).json({ error: 'Contract ID is required' });
    }
    const serviceContract = req.body;
    const updatedServiceContract = await updateServiceContract(contractId, serviceContract);
    return res.json(updatedServiceContract);   
};

// get all service contracts by service supplier id
export const getAllServiceContractsByServiceSupplierIdController = async (req: Request, res: Response) => {
    const serviceSupplierId = req.params['serviceSupplierId'];
    if (!serviceSupplierId) {
        return res.status(400).json({ error: 'Service Supplier ID is required' });
    }
    const serviceContracts = await getAllServiceContractsByServiceSupplierId(serviceSupplierId);
    return res.json(serviceContracts);
};
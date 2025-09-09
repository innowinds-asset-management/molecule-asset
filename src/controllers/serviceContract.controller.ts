//get service contract by asset id
import { Request, Response, NextFunction } from 'express';
import { getServiceContractByAssetId, createServiceContract, updateServiceContract, getAllServiceContractsByServiceSupplierId, getAllServiceContracts, getAllServiceContractsByAssetId } from "../services/serviceContract.service";
import ResponseHandler from '../helper/responseHandler';
import { AssetRequest } from '../middleware/userContextMiddleware'; 

// get all service contracts
export const getAllServiceContractsController =     async (req: AssetRequest, res: Response,next: NextFunction) => {    
   try{
    const { groupstatus } = req.query;
    const consumerId = req._u?.consumerId;
    if(!consumerId){
        return next(new Error('Consumer ID is required'));
    }
    let msg = 'Service contracts fetched successfully';
    const serviceContracts = await getAllServiceContracts(groupstatus as string, consumerId);
    if(serviceContracts.length === 0){
        let msg = 'No service contracts found';
        return ResponseHandler.success(res, msg, serviceContracts);
    }    
    return ResponseHandler.success(res, msg, serviceContracts);
   }catch(error){
    return next(error);
   }
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

// get all service contracts by asset id
export const getAllServiceContractsByAssetIdController = async (req: Request, res: Response) => {
   try{
    const assetId = req.params['assetId'];
    if (!assetId) {
        return res.status(400).json({ error: 'Asset ID is required' });
    }
    const serviceContracts = await getAllServiceContractsByAssetId(assetId);
    return res.json(serviceContracts);
   }catch(error){
    return res.status(500).json({ error: 'Failed to fetch service contracts by asset id' });
   }
}
    

import { Request, Response, NextFunction } from 'express';

export interface AssetRequest extends Request {
  _u?: {
    id: string;
    email: string;
    name: string;
    role: string;
    consumerId: string;
    userId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const extractUserContext = (req: AssetRequest, _res: Response, next: NextFunction) => {
  req._u = {
    id: req.headers['x-user-id'] as string,
    email: req.headers['x-user-email'] as string,
    name: req.headers['x-user-name'] as string,
    role: req.headers['x-user-role'] as string,
    consumerId: req.headers['x-consumer-id'] as string,
    userId: req.headers['x-user-id'] as string,
    isActive: req.headers['x-user-active'] === 'true',
    createdAt: req.headers['x-user-created'] as string,
    updatedAt: req.headers['x-user-updated'] as string
  };
  next();
};

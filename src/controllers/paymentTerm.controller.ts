// /api/v1/payment-terms
import { Request, Response } from 'express';
import { getAllPaymentTerms } from '../services/paymentTerm.service';

export const getAllPaymentTermsController = async (_req: Request, res: Response) => {
  const paymentTerms = await getAllPaymentTerms();
  res.json(paymentTerms);
};


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getAllPaymentTerms = async () => {
  return prisma.paymentTerms.findMany();
};
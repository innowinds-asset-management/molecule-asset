//fetch all purchase orders
import { PrismaClient, PO } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPurchaseOrders = async () => {
  return await prisma.pO.findMany();
};

//fetch purchase order by id    
export const getPurchaseOrderById = async (id: string) => {
  return await prisma.pO.findUnique({
    where: { id },
  });
};

//create purchase order
export const createPurchaseOrder = async (purchaseOrder: PO) => {    
  return await prisma.pO.create({
    data: purchaseOrder,
  });
};

//update purchase order
export const updatePurchaseOrder = async (id: string, purchaseOrder: PO) => {
  return await prisma.pO.update({
    where: { id },  
    data: purchaseOrder,
  });
};

//delete purchase order
export const deletePurchaseOrder = async (id: string) => {
  return await prisma.pO.delete({
    where: { id },
  });
};
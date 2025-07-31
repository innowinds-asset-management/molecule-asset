//fetch all purchase order line items

import { POLineItem, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPurchaseOrderLineItems = async () => {
  return await prisma.pOLineItem.findMany();
};

//fetch purchase order line item by id  
export const getPurchaseOrderLineItemById = async (id: string) => {
  return await prisma.pOLineItem.findUnique({
    where: { id },
  });
};

//create purchase order line item
export const createPurchaseOrderLineItem = async (purchaseOrderLineItem: POLineItem) => {
  return await prisma.pOLineItem.create({
    data: purchaseOrderLineItem,
  });
};

//update purchase order line item
export const updatePurchaseOrderLineItem = async (id: string, purchaseOrderLineItem: POLineItem) => {
  return await prisma.pOLineItem.update({
    where: { id },      
    data: purchaseOrderLineItem,
  });
};

//delete purchase order line item
export const deletePurchaseOrderLineItem = async (id: string) => {
  return await prisma.pOLineItem.delete({
    where: { id },
  });
};
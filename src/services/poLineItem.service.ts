//fetch all purchase order line items

import { POLineItem, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPurchaseOrderLineItems = async () => {
  return await prisma.pOLineItem.findMany({
    include: {
      po: true,
    },
  });
};

//fetch purchase order line item by id  
export const getPurchaseOrderLineItemById = async (id: string) => {
  return await prisma.pOLineItem.findUnique({
    where: { id },
    include: {
      po: true,
    },
  });
};

//create purchase order line item
export const createPurchaseOrderLineItem = async (lineItemData: Omit<POLineItem, 'id' | 'totalAmount' | 'receivedQty' | 'remainingQty' | 'createdAt' | 'updatedAt'>) => {
  const totalAmount = Number(lineItemData.price) * Number(lineItemData.quantity);
  const remainingQty = Number(lineItemData.quantity);
  
  return await prisma.pOLineItem.create({
    data: {
      ...lineItemData,
      totalAmount: totalAmount as any,
      receivedQty: 0 as any,
      remainingQty: remainingQty as any,
    },
    include: {
      po: true,
    },
  });
};

//update purchase order line item
export const updatePurchaseOrderLineItem = async (id: string, lineItemData: Partial<Omit<POLineItem, 'id' | 'createdAt' | 'updatedAt'>>) => {
  // If price or quantity is being updated, recalculate totalAmount
  if (lineItemData.price || lineItemData.quantity) {
    const currentItem = await prisma.pOLineItem.findUnique({ where: { id } });
    if (currentItem) {
      const newPrice = lineItemData.price || currentItem.price;
      const newQuantity = lineItemData.quantity || currentItem.quantity;
      (lineItemData as any).totalAmount = Number(newPrice) * Number(newQuantity);
      (lineItemData as any).remainingQty = Number(newQuantity) - Number((currentItem as any).receivedQty);
    }
  }
  
  return await prisma.pOLineItem.update({
    where: { id },      
    data: lineItemData,
    include: {
      po: true,
    },
  });
};

// Update received quantity for a line item
export const updateReceivedQuantity = async (id: string, receivedQty: number) => {
  const lineItem = await prisma.pOLineItem.findUnique({ where: { id } });
  if (!lineItem) {
    throw new Error('Line item not found');
  }
  
  const newReceivedQty = Number((lineItem as any).receivedQty) + receivedQty;
  const remainingQty = Number(lineItem.quantity) - newReceivedQty;
  
  if (remainingQty < 0) {
    throw new Error('Received quantity cannot exceed ordered quantity');
  }
  
  return await prisma.pOLineItem.update({
    where: { id },
    data: {
      receivedQty: newReceivedQty as any,
      remainingQty: remainingQty as any,
    },
    include: {
      po: true,
    },
  });
};

//delete purchase order line item
export const deletePurchaseOrderLineItem = async (id: string) => {
  return await prisma.pOLineItem.delete({
    where: { id },
  });
};
//fetch all purchase orders
import { PrismaClient, PO } from '@prisma/client';

const prisma = new PrismaClient();


// Generate unique PO number
const generatePONumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const count = await prisma.pO.count({
    where: {
      poNumber: {
        startsWith: `PO-${currentYear}-`
      }
    }
  });
  return `PO-${currentYear}-${String(count + 1).padStart(3, '0')}`;
};

export const getAllPurchaseOrders = async () => {
  return prisma.pO.findMany({
    include: {
      poLineItem: true,
      supplier: true,
      consumer: true,
      //asset: true,
      //assetType: true,
      //assetSubType: true,
      //locations: true,
      //installations: true,
    },
  });
};

//fetch purchase order by id    
export const getPurchaseOrderById = async (id: string) => {
  return prisma.pO.findUnique({
    where: { id },
    include: {
      poLineItem: true,
      supplier:true,
      consumer:true
    },
  });
};

//create purchase order
export const createPurchaseOrder = async (purchaseOrderData: Omit<PO, 'id' | 'poNumber' | 'totalAmount' | 'createdAt' | 'updatedAt'>) => {    
  const poNumber = await generatePONumber();
  
  return await prisma.pO.create({
    data: {
      ...purchaseOrderData,
      poNumber,
      totalAmount: 0, // Will be calculated when line items are added
    },
    include: {
      poLineItem: true,
    },
  });
};

//update purchase order
export const updatePurchaseOrder = async (id: string, purchaseOrderData: Partial<Omit<PO, 'id' | 'poNumber' | 'createdAt' | 'updatedAt'>>) => {
  return await prisma.pO.update({
    where: { id },  
    data: purchaseOrderData,
    include: {
      poLineItem: true,
    },
  });
};

// Calculate and update PO total amount
export const updatePOTotalAmount = async (poId: string) => {
  const lineItems = await prisma.pOLineItem.findMany({
    where: { poId },
    select: { totalAmount: true }
  });
  
  const totalAmount = lineItems.reduce((sum, item) => sum + Number(item.totalAmount), 0);
  
  return await prisma.pO.update({
    where: { id: poId },
    data: { totalAmount },
    include: {
      poLineItem: true,
    },
  });
};

//delete purchase order
export const deletePurchaseOrder = async (id: string) => {
  return await prisma.pO.delete({
    where: { id },
  });
};
//fetch all goods received notes

import { GRN, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllGoodsReceivedNotes = async () => {
  return await prisma.gRN.findMany({
    include: {
      po: true,
      grnItem: {
        include: {
          poLineItem: true,
        },
      },
    },
  });
};

//fetch goods received note by id
export const getGoodsReceivedNoteById = async (id: string) => {
  return await prisma.gRN.findUnique({
    where: { id },
    include: {
      po: true,
      grnItem: {
        include: {
          poLineItem: true,
        },
      },
    },
  });
};

//create goods received note
export const createGoodsReceivedNote = async (goodsReceivedNote: GRN) => {
  return await prisma.gRN.create({
    data: goodsReceivedNote,
  });
};

type CreateGRNWithItemsDto = {
  poId: string;
  challan?: string | null;
  deliveryNote?: string | null;
  deliveryDate?: Date | string | null;
  driverName?: string | null;
  receivedBy?: string | null;
  vehicleNumber?: string | null;
  grnItem?: Array<{
    poLineItemId: string;
    quantityOrdered?: number | string;
    quantityReceived?: number | string;
    quantityAccepted?: number | string;
    quantityRejected?: number | string;
    quantityRemaining?: number | string;
    remarks?: string | null;
  }>;
};

export const createGoodsReceivedNoteWithItems = async (payload: CreateGRNWithItemsDto) => {
  return await prisma.$transaction(async (tx) => {
    const {
      poId,
      challan,
      deliveryNote,
      deliveryDate,
      driverName,
      receivedBy,
      vehicleNumber,
      grnItem = [],
    } = payload;

    const grn = await tx.gRN.create({
      data: {
        poId,
        challan: challan ?? null,
        deliveryNote: deliveryNote ?? null,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        driverName: driverName ?? null,
        receivedBy: receivedBy ?? null,
        vehicleNumber: vehicleNumber ?? null,
      },
    });

    if (Array.isArray(grnItem) && grnItem.length > 0) {
      await tx.gRNItem.createMany({
        data: grnItem.map((it) => ({
          grnId: grn.id,
          poLineItemId: it.poLineItemId,
          quantityOrdered: (it.quantityOrdered as any) ?? 0,
          quantityReceived: (it.quantityReceived as any) ?? 0,
          quantityAccepted: (it.quantityAccepted as any) ?? 0,
          quantityRejected: (it.quantityRejected as any) ?? 0,
          quantityRemaining: (it.quantityRemaining as any) ?? 0,
          remarks: it.remarks ?? null,
        })),
      });
    }

    return await tx.gRN.findUnique({
      where: { id: grn.id },
      include: {
        po: true,
        grnItem: { include: { poLineItem: true } },
      },
    });
  });
};

//update goods received note
export const updateGoodsReceivedNote = async (id: string, goodsReceivedNote: GRN) => {
  return await prisma.gRN.update({
    where: { id },      
    data: goodsReceivedNote,
  });
};

export const updateGoodsReceivedNoteWithItems = async (id: string, payload: Partial<CreateGRNWithItemsDto>) => {
  return await prisma.$transaction(async (tx) => {
    const {
      poId,
      challan,
      deliveryNote,
      deliveryDate,
      driverName,
      receivedBy,
      vehicleNumber,
      grnItem,
    } = payload;

    await tx.gRN.update({
      where: { id },
      data: {
        ...(poId ? { poId } : {}),
        ...(challan !== undefined ? { challan } : {}),
        ...(deliveryNote !== undefined ? { deliveryNote } : {}),
        ...(deliveryDate !== undefined ? { deliveryDate: deliveryDate ? new Date(deliveryDate) : null } : {}),
        ...(driverName !== undefined ? { driverName } : {}),
        ...(receivedBy !== undefined ? { receivedBy } : {}),
        ...(vehicleNumber !== undefined ? { vehicleNumber } : {}),
      },
    });

    if (Array.isArray(grnItem)) {
      await tx.gRNItem.deleteMany({ where: { grnId: id } });
      if (grnItem.length > 0) {
        await tx.gRNItem.createMany({
          data: grnItem.map((it) => ({
            grnId: id,
            poLineItemId: it.poLineItemId,
            quantityOrdered: (it.quantityOrdered as any) ?? 0,
            quantityReceived: (it.quantityReceived as any) ?? 0,
            quantityAccepted: (it.quantityAccepted as any) ?? 0,
            quantityRejected: (it.quantityRejected as any) ?? 0,
            quantityRemaining: (it.quantityRemaining as any) ?? 0,
            remarks: it.remarks ?? null,
          })),
        });
      }
    }

    return await tx.gRN.findUnique({
      where: { id },
      include: {
        po: true,
        grnItem: { include: { poLineItem: true } },
      },
    });
  });
};

//delete goods received note
export const deleteGoodsReceivedNote = async (id: string) => {
  return await prisma.gRN.delete({
    where: { id },
  });
};

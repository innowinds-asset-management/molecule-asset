//fetch all goods received note items

import { GRNItem, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllGoodsReceivedNoteItems = async () => {
  return await prisma.gRNItem.findMany();
};

//fetch goods received note item by id
export const getGoodsReceivedNoteItemById = async (id: string) => {
  return await prisma.gRNItem.findUnique({
    where: { id },
  });
};

//create goods received note item
export const createGoodsReceivedNoteItem = async (goodsReceivedNoteItem: GRNItem) => {
  return await prisma.gRNItem.create({
    data: goodsReceivedNoteItem,
  });
};

//update goods received note item
export const updateGoodsReceivedNoteItem = async (id: string, goodsReceivedNoteItem: GRNItem) => {
  return await prisma.gRNItem.update({
    where: { id },      
    data: goodsReceivedNoteItem,
  });
};

//delete goods received note item
export const deleteGoodsReceivedNoteItem = async (id: string) => {
  return await prisma.gRNItem.delete({
    where: { id },
  });
};
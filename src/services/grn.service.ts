//fetch all goods received notes

import { GRN, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllGoodsReceivedNotes = async () => {
  return await prisma.gRN.findMany();
};

//fetch goods received note by id
export const getGoodsReceivedNoteById = async (id: string) => {
  return await prisma.gRN.findUnique({
    where: { id },
  });
};

//create goods received note
export const createGoodsReceivedNote = async (goodsReceivedNote: GRN) => {
  return await prisma.gRN.create({
    data: goodsReceivedNote,
  });
};

//update goods received note
export const updateGoodsReceivedNote = async (id: string, goodsReceivedNote: GRN) => {
  return await prisma.gRN.update({
    where: { id },      
    data: goodsReceivedNote,
  });
};

//delete goods received note
export const deleteGoodsReceivedNote = async (id: string) => {
  return await prisma.gRN.delete({
    where: { id },
  });
};

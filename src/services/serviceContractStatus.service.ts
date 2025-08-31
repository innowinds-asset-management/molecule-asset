import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// get service contract status by status id
export const getServiceContractStatus = async (statusId: number) => {
  const serviceContractStatus = await prisma.serviceContractStatus.findUnique({
    where: { statusId },
  });
  return serviceContractStatus;
};


//get all service contract statuses
export const getAllServiceContractStatuses = async () => {
  const serviceContractStatuses = await prisma.serviceContractStatus.findMany();
  return serviceContractStatuses;
};


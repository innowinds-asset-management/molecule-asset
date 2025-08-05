import { Department, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllDepartments = async () => {
  return await prisma.department.findMany();
};  

export const getDepartmentById = async (deptId: string) => {
  return await prisma.department.findUnique({
    where: { deptId },
  });
};

export const createDepartment = async (department: Department) => {
  return await prisma.department.create({
    data: department,
  });
};

export const updateDepartment = async (deptId: string, department: Department) => {
  return await prisma.department.update({
    where: { deptId },
    data: department,
  });
};
  
//fetch all departments by  consumer id
export const getDepartmentsByConsumerId = async (consumerId: string) => {
  return await prisma.department.findMany({
    where: { consumerId },
  });
};


export const deleteDepartment = async (deptId: string) => { 
    return await prisma.department.delete({
        where: { deptId },
    });
};
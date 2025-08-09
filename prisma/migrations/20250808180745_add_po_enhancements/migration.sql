/*
  Warnings:

  - Made the column `poNumber` on table `po` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `po` MODIFY `poNumber` VARCHAR(191) NOT NULL;

/*
  Warnings:

  - You are about to drop the `WarrantyType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `warranties` DROP FOREIGN KEY `warranties_warrantyTypeId_fkey`;

-- DropTable
DROP TABLE `WarrantyType`;

-- CreateTable
CREATE TABLE `warrantyType` (
    `warrantyTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `typeName` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `consumerId` VARCHAR(191) NULL,
    `supplierId` VARCHAR(191) NULL,

    PRIMARY KEY (`warrantyTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `warranties` ADD CONSTRAINT `warranties_warrantyTypeId_fkey` FOREIGN KEY (`warrantyTypeId`) REFERENCES `warrantyType`(`warrantyTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

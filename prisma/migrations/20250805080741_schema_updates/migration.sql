/*
  Warnings:

  - You are about to drop the column `building` on the `installation` table. All the data in the column will be lost.
  - You are about to drop the column `departmentName` on the `installation` table. All the data in the column will be lost.
  - You are about to drop the column `floorNumber` on the `installation` table. All the data in the column will be lost.
  - You are about to drop the column `roomNumber` on the `installation` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `installation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installationDate` to the `installation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `installation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `installation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `installation` DROP COLUMN `building`,
    DROP COLUMN `departmentName`,
    DROP COLUMN `floorNumber`,
    DROP COLUMN `roomNumber`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `departmentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `installationDate` DATETIME(3) NOT NULL,
    ADD COLUMN `locationId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `department` (
    `deptId` VARCHAR(191) NOT NULL,
    `deptName` VARCHAR(191) NOT NULL,
    `consumerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `department_consumerId_idx`(`consumerId`),
    PRIMARY KEY (`deptId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `id` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NOT NULL,
    `building` VARCHAR(191) NULL,
    `floorNumber` VARCHAR(191) NULL,
    `roomNumber` VARCHAR(191) NULL,
    `isCurrentLocation` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `location_assetId_fkey`(`assetId`),
    INDEX `location_departmentId_fkey`(`departmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `installation_locationId_fkey` ON `installation`(`locationId`);

-- CreateIndex
CREATE INDEX `installation_departmentId_fkey` ON `installation`(`departmentId`);

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`deptId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `installation` ADD CONSTRAINT `installation_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `installation` ADD CONSTRAINT `installation_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`deptId`) ON DELETE RESTRICT ON UPDATE CASCADE;

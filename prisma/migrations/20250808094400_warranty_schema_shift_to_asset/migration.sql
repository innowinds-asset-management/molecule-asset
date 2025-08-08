/*
  Warnings:

  - You are about to drop the column `warrantyId` on the `asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `asset` DROP COLUMN `warrantyId`;

-- CreateTable
CREATE TABLE `WarrantyType` (
    `warrantyTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `typeName` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`warrantyTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warranties` (
    `warrantyId` INTEGER NOT NULL AUTO_INCREMENT,
    `assetId` VARCHAR(255) NOT NULL,
    `warrantyTypeId` INTEGER NOT NULL,
    `warrantySupplierId` VARCHAR(255) NULL,
    `warrantyNumber` VARCHAR(100) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `warrantyPeriod` INTEGER NULL,
    `coverageType` TEXT NULL,
    `coverageDescription` TEXT NULL,
    `termsConditions` TEXT NULL,
    `cost` DECIMAL(10, 2) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `autoRenewal` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `consumerId` INTEGER NULL,
    `supplierId` INTEGER NULL,

    INDEX `idxEndDate`(`endDate`),
    INDEX `idxAssetId`(`assetId`),
    PRIMARY KEY (`warrantyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warrantyNotifications` (
    `notificationId` INTEGER NOT NULL AUTO_INCREMENT,
    `warrantyId` INTEGER NOT NULL,
    `notificationType` ENUM('Expiry_Warning', 'Expired', 'Renewal_Due', 'Claim_Update') NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `recipientEmail` VARCHAR(191) NULL,
    `sentDate` DATETIME(3) NULL,
    `isSent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`notificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consumerPreferences` (
    `preferenceId` INTEGER NOT NULL AUTO_INCREMENT,
    `consumerId` INTEGER NOT NULL,
    `notificationDays` INTEGER NOT NULL DEFAULT 30,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `consumerPreferences_consumerId_key`(`consumerId`),
    PRIMARY KEY (`preferenceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplierPreferences` (
    `preferenceId` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierId` INTEGER NOT NULL,
    `notificationDays` INTEGER NOT NULL DEFAULT 30,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `supplierPreferences_supplierId_key`(`supplierId`),
    PRIMARY KEY (`preferenceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contractTypes` (
    `contractTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `typeName` ENUM('AMC', 'CMC', 'ON_CALL', 'BREAKDOWN_MAINTENANCE') NOT NULL,
    `typeCode` VARCHAR(10) NOT NULL,
    `description` VARCHAR(191) NULL,
    `contractDurationMonths` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `contractTypes_typeCode_key`(`typeCode`),
    PRIMARY KEY (`contractTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `serviceContractsStatus` (
    `statusId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `serviceContractsStatus_name_key`(`name`),
    PRIMARY KEY (`statusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `serviceContracts` (
    `contractId` INTEGER NOT NULL AUTO_INCREMENT,
    `contractNumber` VARCHAR(100) NOT NULL,
    `contractTypeId` INTEGER NOT NULL,
    `assetId` VARCHAR(255) NOT NULL,
    `serviceSupplierId` INTEGER NOT NULL,
    `contractName` VARCHAR(255) NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `paymentTerms` ENUM('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'ONE_TIME') NOT NULL DEFAULT 'YEARLY',
    `coverageType` ENUM('COMPREHENSIVE', 'PARTS_ONLY', 'LABOR_ONLY', 'PREVENTIVE_ONLY') NOT NULL DEFAULT 'COMPREHENSIVE',
    `includes` VARCHAR(191) NULL,
    `excludes` VARCHAR(191) NULL,
    `serviceFrequency` ENUM('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'AS_REQUIRED') NOT NULL DEFAULT 'QUARTERLY',
    `preventiveMaintenanceIncluded` BOOLEAN NOT NULL DEFAULT true,
    `breakdownMaintenanceIncluded` BOOLEAN NOT NULL DEFAULT true,
    `autoRenewal` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(100) NULL,
    `updatedBy` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `statusId` INTEGER NULL,

    UNIQUE INDEX `serviceContracts_contractNumber_key`(`contractNumber`),
    INDEX `idxContractName`(`contractNumber`),
    INDEX `idxStartDate`(`startDate`),
    INDEX `idxEndDate`(`endDate`),
    INDEX `idxAssetId`(`assetId`),
    PRIMARY KEY (`contractId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `serviceRequest` (
    `serviceRequestId` INTEGER NOT NULL AUTO_INCREMENT,
    `assetId` VARCHAR(255) NOT NULL,
    `technicianName` VARCHAR(100) NOT NULL,
    `serviceSupplierName` VARCHAR(100) NOT NULL,
    `warrantyStatus` ENUM('ACTIVE', 'EXPIRED', 'VOID', 'CLAIMED', 'PENDING_CLAIM', 'TRANSFERRED', 'SUSPENDED', 'NOT_APPLICABLE') NOT NULL,
    `serviceStatus` VARCHAR(50) NULL,
    `serviceDate` DATE NOT NULL,
    `serviceType` VARCHAR(100) NULL,
    `serviceDescription` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `approverName` VARCHAR(191) NULL,

    INDEX `idxServiceRequestDate`(`serviceDate`),
    INDEX `idxServiceRequestAssetId`(`assetId`),
    INDEX `idxWarrantyStatus`(`warrantyStatus`),
    PRIMARY KEY (`serviceRequestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `serviceRequestItem` (
    `serviceRequestItemId` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceRequestId` INTEGER NOT NULL,
    `partName` VARCHAR(255) NOT NULL,
    `partCost` DOUBLE NOT NULL,
    `labourCost` DOUBLE NOT NULL,
    `defectDescription` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idxServiceRequestItemRequestId`(`serviceRequestId`),
    PRIMARY KEY (`serviceRequestItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `warranties` ADD CONSTRAINT `warranties_warrantyTypeId_fkey` FOREIGN KEY (`warrantyTypeId`) REFERENCES `WarrantyType`(`warrantyTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warranties` ADD CONSTRAINT `warranties_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warrantyNotifications` ADD CONSTRAINT `warrantyNotifications_warrantyId_fkey` FOREIGN KEY (`warrantyId`) REFERENCES `warranties`(`warrantyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceContracts` ADD CONSTRAINT `serviceContracts_contractTypeId_fkey` FOREIGN KEY (`contractTypeId`) REFERENCES `contractTypes`(`contractTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceContracts` ADD CONSTRAINT `serviceContracts_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `serviceContractsStatus`(`statusId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceRequest` ADD CONSTRAINT `serviceRequest_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceRequestItem` ADD CONSTRAINT `serviceRequestItem_serviceRequestId_fkey` FOREIGN KEY (`serviceRequestId`) REFERENCES `serviceRequest`(`serviceRequestId`) ON DELETE RESTRICT ON UPDATE CASCADE;

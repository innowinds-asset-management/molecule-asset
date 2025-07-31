-- CreateTable
CREATE TABLE `assetType` (
    `id` VARCHAR(191) NOT NULL,
    `assetName` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `industryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `assetType_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assetSubType` (
    `id` VARCHAR(191) NOT NULL,
    `assetTypeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `assetSubType_code_key`(`code`),
    INDEX `assetSubType_assetTypeId_fkey`(`assetTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset` (
    `id` VARCHAR(191) NOT NULL,
    `assetTypeId` VARCHAR(191) NOT NULL,
    `assetSubTypeId` VARCHAR(191) NOT NULL,
    `assetName` VARCHAR(191) NOT NULL,
    `warrantyPeriod` INTEGER NULL,
    `warrantyStartDate` DATETIME(3) NULL,
    `warrantyEndDate` DATETIME(3) NULL,
    `installationDate` DATETIME(3) NULL,
    `brand` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `subModel` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `consumerId` VARCHAR(191) NOT NULL,
    `partNo` VARCHAR(191) NULL,
    `supplierCode` VARCHAR(191) NULL,
    `warrantyId` VARCHAR(191) NULL,
    `consumerSerialNo` VARCHAR(191) NULL,
    `goodsReceivedId` VARCHAR(191) NULL,
    `goodsReceivedItemId` VARCHAR(191) NULL,
    `poLineItemId` VARCHAR(191) NULL,
    `supplierId` VARCHAR(191) NULL,
    `supplierSerialNo` VARCHAR(191) NULL,

    INDEX `asset_assetSubTypeId_fkey`(`assetSubTypeId`),
    INDEX `asset_assetTypeId_fkey`(`assetTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `installation` (
    `id` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NOT NULL,
    `building` VARCHAR(191) NULL,
    `departmentName` VARCHAR(191) NULL,
    `floorNumber` VARCHAR(191) NULL,
    `roomNumber` VARCHAR(191) NULL,

    INDEX `installation_assetId_fkey`(`assetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `po` (
    `id` VARCHAR(191) NOT NULL,
    `consumerId` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('Draft', 'Issued', 'Approved') NOT NULL DEFAULT 'Draft',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `poLineItem` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `grnId` VARCHAR(191) NULL,
    `partNo` VARCHAR(191) NOT NULL,
    `poId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` DOUBLE NOT NULL,

    INDEX `purchaseItem_poId_fkey`(`poId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grn` (
    `id` VARCHAR(191) NOT NULL,
    `poId` VARCHAR(191) NOT NULL,
    `dateTime` DATETIME(3) NOT NULL,
    `challan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `grn_poId_fkey`(`poId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grnItem` (
    `id` VARCHAR(191) NOT NULL,
    `grnId` VARCHAR(191) NOT NULL,
    `poLineItemId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `grnItem_grnId_fkey`(`grnId`),
    INDEX `grnItem_poLineItemId_fkey`(`poLineItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assetSubType` ADD CONSTRAINT `assetSubType_assetTypeId_fkey` FOREIGN KEY (`assetTypeId`) REFERENCES `assetType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_assetSubTypeId_fkey` FOREIGN KEY (`assetSubTypeId`) REFERENCES `assetSubType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_assetTypeId_fkey` FOREIGN KEY (`assetTypeId`) REFERENCES `assetType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `installation` ADD CONSTRAINT `installation_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `poLineItem` ADD CONSTRAINT `poLineItem_poId_fkey` FOREIGN KEY (`poId`) REFERENCES `po`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grn` ADD CONSTRAINT `grn_poId_fkey` FOREIGN KEY (`poId`) REFERENCES `po`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grnItem` ADD CONSTRAINT `grnItem_grnId_fkey` FOREIGN KEY (`grnId`) REFERENCES `grn`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grnItem` ADD CONSTRAINT `grnItem_poLineItemId_fkey` FOREIGN KEY (`poLineItemId`) REFERENCES `poLineItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

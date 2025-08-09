/*
  Warnings:

  - A unique constraint covering the columns `[poNumber]` on the table `po` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `po` ADD COLUMN `poNumber` VARCHAR(191) NULL,
    ADD COLUMN `totalAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    MODIFY `status` ENUM('Draft', 'PendingApproval', 'Approved', 'Issued', 'PartiallyReceived', 'FullyReceived', 'Cancelled', 'Closed') NOT NULL DEFAULT 'Draft';

-- AlterTable
ALTER TABLE `poLineItem` ADD COLUMN `receivedQty` DECIMAL(10, 3) NOT NULL DEFAULT 0,
    ADD COLUMN `remainingQty` DECIMAL(10, 3) NOT NULL DEFAULT 0,
    ADD COLUMN `totalAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    MODIFY `price` DECIMAL(10, 2) NOT NULL,
    MODIFY `quantity` DECIMAL(10, 3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `po_poNumber_key` ON `po`(`poNumber`);

-- CreateIndex
CREATE INDEX `po_consumerId_idx` ON `po`(`consumerId`);

-- CreateIndex
CREATE INDEX `po_supplierId_idx` ON `po`(`supplierId`);

-- CreateIndex
CREATE INDEX `po_status_idx` ON `po`(`status`);

-- CreateIndex
CREATE INDEX `poLineItem_partNo_idx` ON `poLineItem`(`partNo`);

-- CreateIndex
CREATE INDEX `poLineItem_receivedQty_idx` ON `poLineItem`(`receivedQty`);

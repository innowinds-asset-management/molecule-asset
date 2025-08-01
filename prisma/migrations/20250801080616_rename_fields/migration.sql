/*
  Warnings:

  - You are about to drop the column `goodsReceivedId` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `goodsReceivedItemId` on the `asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `asset` DROP COLUMN `goodsReceivedId`,
    DROP COLUMN `goodsReceivedItemId`,
    ADD COLUMN `grnId` VARCHAR(191) NULL,
    ADD COLUMN `grnItemId` VARCHAR(191) NULL;

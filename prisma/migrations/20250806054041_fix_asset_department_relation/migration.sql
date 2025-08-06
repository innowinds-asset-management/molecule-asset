/*
  Warnings:

  - You are about to drop the `_AssetToDepartment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_AssetToDepartment` DROP FOREIGN KEY `_AssetToDepartment_A_fkey`;

-- DropForeignKey
ALTER TABLE `_AssetToDepartment` DROP FOREIGN KEY `_AssetToDepartment_B_fkey`;

-- DropTable
DROP TABLE `_AssetToDepartment`;

-- CreateIndex
CREATE INDEX `asset_departmentId_fkey` ON `asset`(`departmentId`);

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`deptId`) ON DELETE SET NULL ON UPDATE CASCADE;

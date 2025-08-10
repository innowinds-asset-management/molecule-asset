-- AlterTable
ALTER TABLE `serviceRequest` ADD COLUMN `assetCondition` VARCHAR(100) NULL COMMENT 'Working, Not Working, Working with Conditions, etc.';
ALTER TABLE `serviceRequest` ADD COLUMN `problem` TEXT NULL COMMENT 'Problem description in text form';

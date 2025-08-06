-- CreateTable
CREATE TABLE `_AssetToDepartment` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AssetToDepartment_AB_unique`(`A`, `B`),
    INDEX `_AssetToDepartment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AssetToDepartment` ADD CONSTRAINT `_AssetToDepartment_A_fkey` FOREIGN KEY (`A`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssetToDepartment` ADD CONSTRAINT `_AssetToDepartment_B_fkey` FOREIGN KEY (`B`) REFERENCES `department`(`deptId`) ON DELETE CASCADE ON UPDATE CASCADE;

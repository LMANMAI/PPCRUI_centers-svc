-- AlterTable
ALTER TABLE `center` ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE `CenterRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `centerId` INTEGER NULL,
    `payload` JSON NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `reviewNote` VARCHAR(191) NULL,
    `appliedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CenterRequest` ADD CONSTRAINT `CenterRequest_centerId_fkey` FOREIGN KEY (`centerId`) REFERENCES `Center`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

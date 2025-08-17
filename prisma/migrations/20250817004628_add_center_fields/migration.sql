-- DropForeignKey
ALTER TABLE `centerspecialty` DROP FOREIGN KEY `CenterSpecialty_centerId_fkey`;

-- DropForeignKey
ALTER TABLE `centerspecialty` DROP FOREIGN KEY `CenterSpecialty_specialtyId_fkey`;

-- DropIndex
DROP INDEX `CenterSpecialty_specialtyId_fkey` ON `centerspecialty`;

-- AlterTable
ALTER TABLE `center` ADD COLUMN `capacity` INTEGER NULL,
    ADD COLUMN `closeTime` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `endDay` ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN') NULL,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    ADD COLUMN `openTime` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `respFullName` VARCHAR(191) NULL,
    ADD COLUMN `respLicense` VARCHAR(191) NULL,
    ADD COLUMN `respPhone` VARCHAR(191) NULL,
    ADD COLUMN `startDay` ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN') NULL;

-- CreateTable
CREATE TABLE `CenterDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `centerId` INTEGER NOT NULL,
    `type` ENUM('MUNICIPAL_HABILITATION', 'PLAN_APPROVED', 'PROTOCOL', 'OTHER') NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NULL,
    `mime` VARCHAR(191) NULL,
    `size` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CenterSpecialty` ADD CONSTRAINT `CenterSpecialty_centerId_fkey` FOREIGN KEY (`centerId`) REFERENCES `Center`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CenterSpecialty` ADD CONSTRAINT `CenterSpecialty_specialtyId_fkey` FOREIGN KEY (`specialtyId`) REFERENCES `Specialty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CenterDocument` ADD CONSTRAINT `CenterDocument_centerId_fkey` FOREIGN KEY (`centerId`) REFERENCES `Center`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

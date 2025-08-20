-- CreateTable
CREATE TABLE `AuthLocalProfile` (
    `userId` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `profile` ENUM('PATIENT', 'CENTER_ADMIN', 'ORG_ADMIN') NOT NULL,
    `name` VARCHAR(191) NULL,
    `centerId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

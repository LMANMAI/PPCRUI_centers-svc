-- AlterTable
ALTER TABLE `credential` ADD COLUMN `centerId` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `profile` ENUM('PATIENT', 'CENTER_ADMIN', 'ORG_ADMIN') NOT NULL DEFAULT 'PATIENT';

-- RenameIndex
ALTER TABLE `credential` RENAME INDEX `Credential_orgId_email_key` TO `credential_orgId_email_key`;

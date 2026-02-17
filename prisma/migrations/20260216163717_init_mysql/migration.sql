-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `imageUrl` TEXT NULL,
    `details` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `peopleHelped` INTEGER NOT NULL DEFAULT 0,
    `categoryId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Volunteer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `signupDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `skills` TEXT NOT NULL,
    `interests` JSON NOT NULL,
    `availability` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Volunteer_email_key`(`email`),
    UNIQUE INDEX `Volunteer_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donation` (
    `id` VARCHAR(191) NOT NULL,
    `donorName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `joinDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` VARCHAR(191) NOT NULL,
    `appName` VARCHAR(191) NULL,
    `logo` TEXT NULL,
    `logoType` VARCHAR(191) NULL,
    `volunteerIcon` VARCHAR(191) NULL,
    `heroTitle` VARCHAR(191) NULL,
    `heroDescription` VARCHAR(191) NULL,
    `heroImage` TEXT NULL,
    `heroImage1` TEXT NULL,
    `heroImage2` TEXT NULL,
    `heroImage3` TEXT NULL,
    `heroImage4` TEXT NULL,
    `missionIntroTitle` VARCHAR(191) NULL,
    `missionIntroDescription` VARCHAR(191) NULL,
    `missionImage` TEXT NULL,
    `missionTitle` VARCHAR(191) NULL,
    `missionDescription` VARCHAR(191) NULL,
    `visionTitle` VARCHAR(191) NULL,
    `visionDescription` VARCHAR(191) NULL,
    `valuesTitle` VARCHAR(191) NULL,
    `valuesDescription` VARCHAR(191) NULL,
    `volunteerIntroTitle` VARCHAR(191) NULL,
    `volunteerIntroDescription1` VARCHAR(191) NULL,
    `volunteerIntroDescription2` VARCHAR(191) NULL,
    `socialLinksTwitter` VARCHAR(191) NULL,
    `socialLinksFacebook` VARCHAR(191) NULL,
    `socialLinksInstagram` VARCHAR(191) NULL,
    `socialLinksYoutube` VARCHAR(191) NULL,
    `socialLinksTelegram` VARCHAR(191) NULL,
    `socialLinksWhatsApp` VARCHAR(191) NULL,
    `socialLinksEmail` VARCHAR(191) NULL,
    `socialLinksLinkedin` VARCHAR(191) NULL,
    `socialLinksTikTok` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

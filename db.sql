--Create table users
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `verificationEmail` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
);

--Create table roles
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
);

-- Create JoinTable UserRoles
CREATE TABLE `UserRoles` (
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    PRIMARY KEY (`userId`, `roleId`)
);

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create table RefreshToken
CREATE TABLE `RefreshToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `expirationDate` DATETIME NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `color` VARCHAR(20) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `id_last_user` INTEGER NOT NULL,
    `last_modification_description` VARCHAR(191) NOT NULL,
    `last_modification_date` DATETIME NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT `Item_id_last_user_fkey` FOREIGN KEY (`id_last_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);
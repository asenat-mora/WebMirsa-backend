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

insert into Role (name) values ('Administrador');
insert into Role (name) values ('Capturista');

CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `side` VARCHAR(191) NOT NULL,
    `id_last_user` INTEGER NOT NULL,
    `last_modification_description` VARCHAR(191) NOT NULL,
    `last_modification_date` DATETIME NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`id`),
    CONSTRAINT `Item_id_last_user_fkey` FOREIGN KEY (`id_last_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `Color`(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
);

insert into Color (name) values ('Humo');
insert into Color (name) values ('Rojo');
insert into Color (name) values ('Ambar');
insert into Color (name) values ('Cristal');
insert into Color (name) values ('Azul');
insert into Color (name) values ('Verde');
insert into Color (name) values ('Cristal');
insert into Color (name) values ('Cromo');
insert into Color (name) values ('Negro');
insert into Color (name) values ('Bicolor');
insert into Color (name) values ('Blanco');
insert into Color (name) values ('Transparente');


CREATE TABLE `ItemColor`(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_id` INTEGER NOT NULL,
    `color_id` INTEGER NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `ItemColor_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `ItemColor_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `Brand`(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) UNIQUE NOT NULL,
    `id_last_user` INTEGER NOT NULL,
    `last_modification_description` VARCHAR(191) NOT NULL,
    `last_modification_date` DATETIME NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`id`),
    CONSTRAINT `Brand_id_last_user_fkey` FOREIGN KEY (`id_last_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `Autopart`(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) UNIQUE NOT NULL,
    `id_last_user` INTEGER NOT NULL,
    `last_modification_description` VARCHAR(191) NOT NULL,
    `last_modification_date` DATETIME NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`id`),
    CONSTRAINT `Autopart_id_last_user_fkey` FOREIGN KEY (`id_last_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);


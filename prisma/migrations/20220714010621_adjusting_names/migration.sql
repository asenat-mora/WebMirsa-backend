/*
  Warnings:

  - You are about to drop the `autopart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemcolor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `autopart` DROP FOREIGN KEY `Autopart_id_last_user_fkey`;

-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_autoPartId_fkey`;

-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_brandId_fkey`;

-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_id_last_user_fkey`;

-- DropForeignKey
ALTER TABLE `itemcolor` DROP FOREIGN KEY `ItemColor_color_id_fkey`;

-- DropForeignKey
ALTER TABLE `itemcolor` DROP FOREIGN KEY `ItemColor_item_id_fkey`;

-- AlterTable
ALTER TABLE `brand` MODIFY `last_modification_date` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `autopart`;

-- DropTable
DROP TABLE `item`;

-- DropTable
DROP TABLE `itemcolor`;

-- CreateTable
CREATE TABLE `accessory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `id_last_user` INTEGER NOT NULL,
    `last_modification_description` VARCHAR(191) NOT NULL,
    `last_modification_date` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `name`(`name`),
    INDEX `Accessory_id_last_user_fkey`(`id_last_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `side` VARCHAR(191) NOT NULL,
    `id_last_user` INTEGER NOT NULL,
    `accessoryId` INTEGER NOT NULL,
    `brandId` INTEGER NOT NULL,
    `last_modification_description` VARCHAR(191) NOT NULL,
    `last_modification_date` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `code`(`code`),
    INDEX `Product_accessoryId_fkey`(`accessoryId`),
    INDEX `Product_brandId_fkey`(`brandId`),
    INDEX `Product_id_last_user_fkey`(`id_last_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productcolor` (
    `product_id` INTEGER NOT NULL,
    `color_id` INTEGER NOT NULL,

    INDEX `ProductColor_color_id_fkey`(`color_id`),
    PRIMARY KEY (`product_id`, `color_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accessory` ADD CONSTRAINT `Accessory_id_last_user_fkey` FOREIGN KEY (`id_last_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_accessoryId_fkey` FOREIGN KEY (`accessoryId`) REFERENCES `accessory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_id_last_user_fkey` FOREIGN KEY (`id_last_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productcolor` ADD CONSTRAINT `ProductColor_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productcolor` ADD CONSTRAINT `ProductColor_item_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `refreshtoken` RENAME INDEX `token` TO `RefreshToken_token_unique`;

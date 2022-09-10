-- CreateTable
CREATE TABLE `productsubbrand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `subbrandId` INTEGER NOT NULL,

    INDEX `Product_sub_brand_productId_fkey`(`productId`),
    INDEX `Product_sub_brand_subbrandId_fkey`(`subbrandId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `productsubbrand` ADD CONSTRAINT `Product_sub_brand_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productsubbrand` ADD CONSTRAINT `Product_sub_brand_subbrandId_fkey` FOREIGN KEY (`subbrandId`) REFERENCES `subbrand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

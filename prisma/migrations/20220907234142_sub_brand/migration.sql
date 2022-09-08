-- CreateTable
CREATE TABLE `subbrand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `id_last_user` INTEGER NOT NULL,
    `last_modification_description` VARCHAR(191) NOT NULL,
    `last_modification_date` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `brandId` INTEGER NOT NULL,

    UNIQUE INDEX `name`(`name`),
    INDEX `Sub_brand_id_last_user_fkey`(`id_last_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subbrand` ADD CONSTRAINT `Sub_brand_id_last_user_fkey` FOREIGN KEY (`id_last_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subbrand` ADD CONSTRAINT `Sub_brand_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

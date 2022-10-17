-- AlterTable
ALTER TABLE `color` ADD COLUMN `id_last_user` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `last_modification_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `last_modification_description` VARCHAR(191) NOT NULL DEFAULT 'Creado';

-- AddForeignKey
ALTER TABLE `color` ADD CONSTRAINT `Color_id_last_user_fkey` FOREIGN KEY (`id_last_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

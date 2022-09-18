-- DropIndex
DROP INDEX `Color_id_last_user_fkey` ON `color`;

-- AlterTable
ALTER TABLE `color` ALTER COLUMN `id_last_user` DROP DEFAULT,
    ALTER COLUMN `last_modification_date` DROP DEFAULT,
    ALTER COLUMN `last_modification_description` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `color` ADD CONSTRAINT `color_id_last_user_fkey` FOREIGN KEY (`id_last_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

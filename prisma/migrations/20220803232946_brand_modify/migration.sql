/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `brand` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `brand` ALTER COLUMN `key` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `key` ON `brand`(`key`);

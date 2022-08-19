/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `sku` ON `product`(`sku`);

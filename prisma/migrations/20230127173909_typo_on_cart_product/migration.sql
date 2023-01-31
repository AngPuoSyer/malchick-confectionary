/*
  Warnings:

  - The primary key for the `CartProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `prodcutId` on the `CartProduct` table. All the data in the column will be lost.
  - Added the required column `productId` to the `CartProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartProduct" DROP CONSTRAINT "CartProduct_prodcutId_fkey";

-- AlterTable
ALTER TABLE "CartProduct" DROP CONSTRAINT "CartProduct_pkey",
DROP COLUMN "prodcutId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD CONSTRAINT "CartProduct_pkey" PRIMARY KEY ("cartId", "productId");

-- AddForeignKey
ALTER TABLE "CartProduct" ADD CONSTRAINT "CartProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

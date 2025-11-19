/*
  Warnings:

  - Added the required column `category` to the `DonatedItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `DonatedItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DonatedItem" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "DonatedItem_donorId_idx" ON "DonatedItem"("donorId");

-- CreateIndex
CREATE INDEX "DonatedItem_programId_idx" ON "DonatedItem"("programId");

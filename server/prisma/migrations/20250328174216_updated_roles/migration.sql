/*
  Warnings:

  - You are about to drop the column `role` on the `Donor` table. All the data in the column will be lost.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Donor" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;

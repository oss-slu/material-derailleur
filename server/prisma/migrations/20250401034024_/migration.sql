/*
  Warnings:

  - You are about to drop the column `firstLogin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstLogin",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry";

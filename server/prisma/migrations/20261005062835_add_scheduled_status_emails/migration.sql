-- AlterTable
ALTER TABLE "DonatedItemStatus" ADD COLUMN     "emailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduledSendAt" TIMESTAMP(3);

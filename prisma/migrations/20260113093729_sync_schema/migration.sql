/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Consignment` table. All the data in the column will be lost.
  - Made the column `confirmedPrice` on table `ConsignmentItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `salesChannel` on table `ConsignmentItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Consignment" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ConsignmentItem" ALTER COLUMN "confirmedPrice" SET NOT NULL,
ALTER COLUMN "salesChannel" SET NOT NULL;

-- CreateTable
CREATE TABLE "ConsignmentImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "consignmentId" TEXT NOT NULL,

    CONSTRAINT "ConsignmentImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConsignmentImage" ADD CONSTRAINT "ConsignmentImage_consignmentId_fkey" FOREIGN KEY ("consignmentId") REFERENCES "Consignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

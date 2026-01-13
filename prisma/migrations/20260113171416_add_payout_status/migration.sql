-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isSold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payoutStatusId" INTEGER,
ADD COLUMN     "soldAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PayoutStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayoutStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_payoutStatusId_fkey" FOREIGN KEY ("payoutStatusId") REFERENCES "PayoutStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

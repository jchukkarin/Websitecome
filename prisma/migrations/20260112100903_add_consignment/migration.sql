-- CreateTable
CREATE TABLE "Consignment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lot" TEXT NOT NULL,
    "consignorName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsignmentItem" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "confirmedPrice" DOUBLE PRECISION,
    "salesChannel" TEXT,
    "imageUrl" TEXT,
    "consignmentId" TEXT NOT NULL,

    CONSTRAINT "ConsignmentItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConsignmentItem" ADD CONSTRAINT "ConsignmentItem_consignmentId_fkey" FOREIGN KEY ("consignmentId") REFERENCES "Consignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

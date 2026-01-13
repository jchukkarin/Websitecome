-- CreateTable
CREATE TABLE "ShopProfile" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "shopName" TEXT NOT NULL DEFAULT 'Naitounai',
    "address" TEXT NOT NULL DEFAULT '-',
    "subDistrict" TEXT NOT NULL DEFAULT '-',
    "district" TEXT NOT NULL DEFAULT '-',
    "province" TEXT NOT NULL DEFAULT '-',
    "zipCode" TEXT NOT NULL DEFAULT '-',
    "line" TEXT,
    "shopee" TEXT,
    "facebook" TEXT,
    "phone" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "importStatusId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_importStatusId_fkey" FOREIGN KEY ("importStatusId") REFERENCES "ImportStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "ItemAttribute" (
    "id" SERIAL NOT NULL,
    "descriptor" TEXT NOT NULL,
    "stringValue" TEXT,
    "numberValue" DOUBLE PRECISION,
    "booleanValue" BOOLEAN,
    "donatedItemId" INTEGER NOT NULL,

    CONSTRAINT "ItemAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemAttribute_donatedItemId_idx" ON "ItemAttribute"("donatedItemId");

-- CreateIndex
CREATE INDEX "ItemAttribute_descriptor_idx" ON "ItemAttribute"("descriptor");

-- CreateIndex
CREATE INDEX "ItemAttribute_descriptor_stringValue_idx" ON "ItemAttribute"("descriptor", "stringValue");

-- CreateIndex
CREATE INDEX "ItemAttribute_descriptor_numberValue_idx" ON "ItemAttribute"("descriptor", "numberValue");

-- CreateIndex
CREATE INDEX "ItemAttribute_descriptor_booleanValue_idx" ON "ItemAttribute"("descriptor", "booleanValue");

-- AddForeignKey
ALTER TABLE "ItemAttribute" ADD CONSTRAINT "ItemAttribute_donatedItemId_fkey" FOREIGN KEY ("donatedItemId") REFERENCES "DonatedItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

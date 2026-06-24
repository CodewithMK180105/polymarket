-- AddColumn: category and endDate to Market table
ALTER TABLE "Market" ADD COLUMN "category" TEXT;
ALTER TABLE "Market" ADD COLUMN "endDate" TIMESTAMP(3);

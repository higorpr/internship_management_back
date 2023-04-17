/*
  Warnings:

  - The `last_version_sent` column on the `reports` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "reports" DROP COLUMN "last_version_sent",
ADD COLUMN     "last_version_sent" INTEGER;

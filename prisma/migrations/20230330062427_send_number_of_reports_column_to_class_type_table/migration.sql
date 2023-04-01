/*
 Warnings:
 
 - You are about to drop the column `number_reports` on the `classes` table. All the data in the column will be lost.
 
 */
-- AlterTable
ALTER TABLE
  "class_type"
ADD
  COLUMN "number_reports" INTEGER;

-- AlterTable
ALTER TABLE
  "classes" DROP COLUMN "number_reports";
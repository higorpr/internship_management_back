/*
  Warnings:

  - Added the required column `background_color` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "background_color" TEXT NOT NULL;

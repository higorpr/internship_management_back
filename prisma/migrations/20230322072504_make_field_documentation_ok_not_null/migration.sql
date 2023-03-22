/*
  Warnings:

  - Made the column `documentation_ok` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "documentation_ok" SET NOT NULL;

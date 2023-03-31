/*
  Warnings:

  - Added the required column `class_type_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Made the column `end_date` on table `classes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "class_type_id" INTEGER NOT NULL,
ALTER COLUMN "end_date" SET NOT NULL,
ALTER COLUMN "number_reports" DROP NOT NULL;

-- CreateTable
CREATE TABLE "class_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "class_type_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_fk1" FOREIGN KEY ("class_type_id") REFERENCES "class_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

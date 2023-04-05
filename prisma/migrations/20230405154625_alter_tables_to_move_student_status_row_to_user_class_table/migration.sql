/*
  Warnings:

  - You are about to drop the column `student_status_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_fk2";

-- AlterTable
ALTER TABLE "user_class" ADD COLUMN     "student_status_id" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "student_status_id";

-- AddForeignKey
ALTER TABLE "user_class" ADD CONSTRAINT "user_class_fk0" FOREIGN KEY ("student_status_id") REFERENCES "student_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

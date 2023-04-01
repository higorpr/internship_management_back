/*
  Warnings:

  - You are about to drop the column `class_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_fk1";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "class_id";

-- CreateTable
CREATE TABLE "user_class" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "user_class_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_class" ADD CONSTRAINT "user_class_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_class" ADD CONSTRAINT "user_class_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

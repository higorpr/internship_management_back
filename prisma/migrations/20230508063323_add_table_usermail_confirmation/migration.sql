-- CreateTable
CREATE TABLE "usermail_confirmation" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "confirmation_code" INTEGER NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usermail_confirmation_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usermail_confirmation_user_id_key" ON "usermail_confirmation"("user_id");

-- AddForeignKey
ALTER TABLE "usermail_confirmation" ADD CONSTRAINT "usermail_confirmation_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

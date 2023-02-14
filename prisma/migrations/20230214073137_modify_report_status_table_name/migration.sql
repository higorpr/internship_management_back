-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "periodicity" INTEGER NOT NULL,
    "number_reports" INTEGER NOT NULL,
    "class_code" TEXT NOT NULL,

    CONSTRAINT "classes_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "companies_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internships" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "weekly_hours" INTEGER NOT NULL,

    CONSTRAINT "internships_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "is_delivered" BOOLEAN NOT NULL,
    "report_number" INTEGER NOT NULL,
    "internship_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "delivery_date" DATE,
    "last_version_sent" TEXT NOT NULL,
    "due_date" DATE NOT NULL,

    CONSTRAINT "reports_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "status_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "student_status_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_types_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "user_type_id" INTEGER NOT NULL,
    "class_id" INTEGER,
    "student_status_id" INTEGER,
    "documentation_ok" BOOLEAN,

    CONSTRAINT "users_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "report_status_name_key" ON "report_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_types_name_key" ON "user_types"("name");

-- AddForeignKey
ALTER TABLE "internships" ADD CONSTRAINT "internships_fk0" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "internships" ADD CONSTRAINT "internships_fk1" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_fk0" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_fk1" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_fk2" FOREIGN KEY ("internship_id") REFERENCES "internships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_fk3" FOREIGN KEY ("status_id") REFERENCES "report_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("user_type_id") REFERENCES "user_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fk1" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fk2" FOREIGN KEY ("student_status_id") REFERENCES "student_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

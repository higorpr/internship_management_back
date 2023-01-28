CREATE TABLE "public.users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	"user_type_id" integer NOT NULL,
	"class_id" integer,
	"student_status_id" integer,
	"documentation_ok" BOOLEAN,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.classes" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"is_active" BOOLEAN NOT NULL,
	"start_date" DATE NOT NULL,
	"end_date" DATE,
	"periodicity" integer NOT NULL,
	"number_reports" integer NOT NULL,
	"class_code" TEXT NOT NULL,
	CONSTRAINT "classes_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.user_types" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "user_types_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.reports" (
	"id" serial NOT NULL,
	"student_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"is_delivered" BOOLEAN NOT NULL,
	"report_number" integer NOT NULL,
	"internship_id" integer NOT NULL,
	"status_id" integer NOT NULL,
	"delivery_date" DATE,
	"last_version_sent" TEXT NOT NULL,
	"due_date" DATE NOT NULL,
	CONSTRAINT "reports_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.status" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "status_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.internships" (
	"id" serial NOT NULL,
	"company_id" TEXT NOT NULL,
	"student_id" integer NOT NULL,
	"start_date" DATE NOT NULL,
	"end_date" DATE NOT NULL,
	"weekly_hours" integer NOT NULL,
	CONSTRAINT "internships_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.companies" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	CONSTRAINT "companies_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.student_status" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	CONSTRAINT "student_status_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("class_id") REFERENCES "classes"("id");
ALTER TABLE "users" ADD CONSTRAINT "users_fk1" FOREIGN KEY ("student_status_id") REFERENCES "student_status"("id");


ALTER TABLE "user_types" ADD CONSTRAINT "user_types_fk0" FOREIGN KEY ("id") REFERENCES "users"("user_type_id");

ALTER TABLE "reports" ADD CONSTRAINT "reports_fk0" FOREIGN KEY ("student_id") REFERENCES "users"("id");
ALTER TABLE "reports" ADD CONSTRAINT "reports_fk1" FOREIGN KEY ("class_id") REFERENCES "classes"("id");
ALTER TABLE "reports" ADD CONSTRAINT "reports_fk2" FOREIGN KEY ("internship_id") REFERENCES "internships"("id");
ALTER TABLE "reports" ADD CONSTRAINT "reports_fk3" FOREIGN KEY ("status_id") REFERENCES "status"("id");


ALTER TABLE "internships" ADD CONSTRAINT "internships_fk0" FOREIGN KEY ("company_id") REFERENCES "companies"("id");
ALTER TABLE "internships" ADD CONSTRAINT "internships_fk1" FOREIGN KEY ("student_id") REFERENCES "users"("id");












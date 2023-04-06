-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "last_version_sent" DROP NOT NULL,
ALTER COLUMN "due_date" DROP NOT NULL;

/*
  Warnings:

  - You are about to drop the `skills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_candidtaesId_fkey";

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_jobsId_fkey";

-- AlterTable
ALTER TABLE "Candidates" ADD COLUMN     "skills" TEXT,
ALTER COLUMN "resume" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "skills" TEXT;

-- DropTable
DROP TABLE "skills";

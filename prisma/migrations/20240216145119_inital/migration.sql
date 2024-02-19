/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linkedin_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CANDIADATE', 'REFERESS');

-- CreateEnum
CREATE TYPE "Speciality" AS ENUM ('TECHNOLOGY', 'FINANCE', 'HEALTHCARE', 'EDUCATION', 'RETAIL', 'REAL_ESTATE', 'MANUFACTURING', 'CONSTRUCTION', 'TRANSPORTATION', 'AGRICULTURE', 'ENERGY', 'MEDIA_ENTERTAINMENT', 'HOSPITALITY');

-- CreateEnum
CREATE TYPE "JobTitle" AS ENUM ('DATA_SCIENTIST', 'MACHINE_LEARNING_ENGINEER', 'AI_ENGINEER', 'BLOCKCHAIN_DEVELOPER', 'CLOUD_ARCHITECT', 'CYBERSECURITY_ANALYST', 'SECURITY_ENGINEER', 'NETWORK_ENGINEER', 'IT_SUPPORT_SPECIALIST', 'WEB_ANALYST', 'DIGITAL_MARKETING_SPECIALIST', 'SEO_SPECIALIST', 'CONTENT_WRITER', 'SOCIAL_MEDIA_MANAGER', 'FINANCIAL_ANALYST', 'INVESTMENT_BANKER', 'WEALTH_MANAGEMENT_ADVISOR', 'FINANCIAL_PLANNER', 'ACCOUNTANT', 'AUDITOR', 'TAX_ADVISOR', 'RISK_ANALYST', 'COMPLIANCE_OFFICER', 'ANTI_MONEY_LAUNDERING_SPECIALIST', 'FRAUD_ANALYST', 'PHYSICIAN_ASSISTANT', 'NURSE_PRACTITIONER', 'RESPIRATORY_THERAPIST', 'CLINICAL_LABORATORY_TECHNICIAN', 'MEDICAL_ASSISTANT', 'EMERGENCY_MEDICAL_TECHNICIAN', 'PARAMEDIC', 'PHARMACIST', 'PHYSICAL_THERAPIST_ASSISTANT', 'OCCUPATIONAL_THERAPIST_ASSISTANT', 'SPEECH_LANGUAGE_PATHOLOGIST_ASSISTANT', 'TEACHER', 'PROFESSOR', 'LECTURER', 'INSTRUCTIONAL_DESIGNER', 'CURRICULUM_DEVELOPER', 'EDUCATIONAL_TECHNOLOGY_SPECIALIST', 'SCHOOL_COUNSELOR', 'SCHOOL_ADMINISTRATOR', 'EARLY_CHILDHOOD_EDUCATOR', 'STORE_MANAGER', 'ASSISTANT_MANAGER', 'SALES_ASSOCIATE', 'CASHIER', 'MERCHANDISER', 'BUYER', 'SUPPLY_CHAIN_MANAGER', 'LOGISTICS_SPECIALIST', 'E_COMMERCE_MANAGER', 'CUSTOMER_SERVICE_REPRESENTATIVE', 'REAL_ESTATE_AGENT', 'REALTOR', 'BROKER', 'APPRAISER', 'PROPERTY_MANAGER', 'LOAN_OFFICER', 'MECHANICAL_ENGINEER', 'CHEMICAL_ENGINEER', 'INDUSTRIAL_ENGINEER', 'MANUFACTURING_ENGINEER', 'QUALITY_CONTROL_INSPECTOR', 'SUPPLY_CHAIN_ANALYST', 'PRODUCTION_SUPERVISOR', 'LINE_WORKER', 'PROJECT_MANAGER', 'ARCHITECT', 'ENGINEER', 'CONSTRUCTION_MANAGER', 'SITE_SUPERINTENDENT', 'CARPENTER', 'ELECTRICIAN', 'PLUMBER', 'HVAC_TECHNICIAN', 'TRUCK_DRIVER', 'PILOT', 'SHIP_CAPTAIN', 'TRAIN_CONDUCTOR', 'LOGISTICS_COORDINATOR', 'FREIGHT_BROKER', 'FARM_MANAGER', 'AGRONOMIST', 'ANIMAL_SCIENTIST', 'FOOD_SCIENTIST', 'SUSTAINABLE_AGRICULTURE_SPECIALIST', 'AGRICULTURAL_TECHNICIAN', 'FARMWORKER', 'RENEWABLE_ENERGY_ENGINEER', 'SUSTAINABILITY_ANALYST', 'OIL_GAS_ENGINEER', 'POWER_PLANT_OPERATOR', 'TRANSMISSION_DISTRIBUTION_TECHNICIAN', 'NUCLEAR_ENGINEER', 'SMART_GRID_SPECIALIST', 'JOURNALIST', 'PUBLIC_RELATIONS_SPECIALIST', 'MARKETING_MANAGER', 'ADVERTISING_SPECIALIST', 'FILM_PRODUCER', 'DIRECTOR', 'ACTOR');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FullTime', 'PartTime', 'Contract', 'Internship', 'Temporary');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('Public', 'Private', 'NonProfit', 'Government', 'Educational');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fullname" TEXT NOT NULL,
ADD COLUMN     "google_id" TEXT,
ADD COLUMN     "linkedin_id" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "type" "UserType",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Candidates" (
    "id" TEXT NOT NULL,
    "job_title" "JobTitle" NOT NULL,
    "description" TEXT NOT NULL,
    "speciality" "Speciality" NOT NULL,
    "employment_type" "JobType" NOT NULL,
    "experience" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referees" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "JobsRefereed" INTEGER,
    "HiredRefereed" INTEGER,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "JobType" NOT NULL,
    "location" TEXT NOT NULL,
    "SalaryRange" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "speciality" "Speciality" NOT NULL,
    "experience" TEXT NOT NULL,
    "benefits" TEXT[],
    "number_of_applicants" INTEGER NOT NULL,
    "applicationsDeadline" TIMESTAMP(3) NOT NULL,
    "advertised" BOOLEAN NOT NULL,
    "HiringManagerID" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "advertismentsId" TEXT,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertisments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3) NOT NULL,
    "byRefereeId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Advertisments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comapnies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "speciality" "Speciality" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Comapnies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobsId" TEXT,
    "candidtaesId" TEXT,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CandidatesToJobs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidates_user_id_key" ON "Candidates"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Referees_user_id_key" ON "Referees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_CandidatesToJobs_AB_unique" ON "_CandidatesToJobs"("A", "B");

-- CreateIndex
CREATE INDEX "_CandidatesToJobs_B_index" ON "_CandidatesToJobs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_google_id_key" ON "User"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_linkedin_id_key" ON "User"("linkedin_id");

-- AddForeignKey
ALTER TABLE "Candidates" ADD CONSTRAINT "Candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referees" ADD CONSTRAINT "Referees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_HiringManagerID_fkey" FOREIGN KEY ("HiringManagerID") REFERENCES "Referees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_advertismentsId_fkey" FOREIGN KEY ("advertismentsId") REFERENCES "Advertisments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advertisments" ADD CONSTRAINT "Advertisments_byRefereeId_fkey" FOREIGN KEY ("byRefereeId") REFERENCES "Referees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_jobsId_fkey" FOREIGN KEY ("jobsId") REFERENCES "Jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_candidtaesId_fkey" FOREIGN KEY ("candidtaesId") REFERENCES "Candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidatesToJobs" ADD CONSTRAINT "_CandidatesToJobs_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidatesToJobs" ADD CONSTRAINT "_CandidatesToJobs_B_fkey" FOREIGN KEY ("B") REFERENCES "Jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - The values [REFERESS] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ConnectionType" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('CANDIADATE', 'REFEREES');
ALTER TABLE "User" ALTER COLUMN "type" TYPE "UserType_new" USING ("type"::text::"UserType_new");
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "UserType_old";
COMMIT;

-- CreateTable
CREATE TABLE "Connections" (
    "id" TEXT NOT NULL,
    "connectionStatus" "ConnectionType" NOT NULL,
    "connectedCandidateId" TEXT NOT NULL,
    "connectedByRefereeId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_connectedCandidateId_fkey" FOREIGN KEY ("connectedCandidateId") REFERENCES "Candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_connectedByRefereeId_fkey" FOREIGN KEY ("connectedByRefereeId") REFERENCES "Referees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

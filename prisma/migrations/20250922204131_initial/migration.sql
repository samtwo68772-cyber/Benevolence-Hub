/*
  Warnings:

  - The `details` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `heroImages` on the `Settings` table. All the data in the column will be lost.
  - The `interests` column on the `Volunteer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `availability` column on the `Volunteer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Donation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Volunteer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "details",
ADD COLUMN     "details" TEXT[],
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "peopleHelped" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "heroImages",
ADD COLUMN     "heroImage" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Volunteer" DROP COLUMN "interests",
ADD COLUMN     "interests" TEXT[],
DROP COLUMN "availability",
ADD COLUMN     "availability" TEXT[],
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DonationType";

-- DropEnum
DROP TYPE "ProjectStatus";

-- DropEnum
DROP TYPE "UserRole";

-- DropEnum
DROP TYPE "VolunteerStatus";

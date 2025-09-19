-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('Planning', 'Active', 'Completed');

-- CreateEnum
CREATE TYPE "public"."ProjectCategory" AS ENUM ('Water', 'Education', 'Medical', 'Community', 'DisasterRelief');

-- CreateEnum
CREATE TYPE "public"."VolunteerStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "public"."DonationType" AS ENUM ('ONE_TIME', 'MONTHLY');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "details" TEXT[],
    "status" "public"."ProjectStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "peopleHelped" INTEGER NOT NULL,
    "category" "public"."ProjectCategory" NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Volunteer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "signupDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skills" TEXT NOT NULL,
    "interests" TEXT[],
    "availability" TEXT[],
    "status" "public"."VolunteerStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Donation" (
    "id" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "public"."DonationType" NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_email_key" ON "public"."Volunteer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

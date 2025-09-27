/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Volunteer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "peopleHelped" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "socialLinksEmail" TEXT,
ADD COLUMN     "socialLinksLinkedin" TEXT,
ADD COLUMN     "socialLinksTelegram" TEXT,
ADD COLUMN     "socialLinksTikTok" TEXT,
ADD COLUMN     "socialLinksWhatsApp" TEXT,
ADD COLUMN     "socialLinksYoutube" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "Volunteer" ALTER COLUMN "status" SET DEFAULT 'Pending';

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_phone_key" ON "Volunteer"("phone");

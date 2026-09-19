/*
  Warnings:

  - You are about to drop the column `images` on the `venues` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "venues" DROP COLUMN "images";

-- CreateTable
CREATE TABLE "venue_images" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venue_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "venue_images" ADD CONSTRAINT "venue_images_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

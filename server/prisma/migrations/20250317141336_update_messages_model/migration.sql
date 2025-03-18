/*
  Warnings:

  - You are about to drop the column `image` on the `GroupMessage` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GroupMessage" DROP COLUMN "image",
ADD COLUMN     "file" TEXT,
ADD COLUMN     "fileSize" INTEGER;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "image",
ADD COLUMN     "fileSize" INTEGER;

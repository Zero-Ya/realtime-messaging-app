/*
  Warnings:

  - You are about to drop the column `profileImg` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "profileImg",
ADD COLUMN     "groupImg" TEXT;

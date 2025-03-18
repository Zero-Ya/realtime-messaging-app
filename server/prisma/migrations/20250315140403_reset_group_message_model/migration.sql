/*
  Warnings:

  - You are about to drop the column `userId` on the `GroupMessage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupMessage" DROP CONSTRAINT "GroupMessage_senderId_fkey";

-- DropIndex
DROP INDEX "GroupMessage_senderId_key";

-- AlterTable
ALTER TABLE "GroupMessage" DROP COLUMN "userId";

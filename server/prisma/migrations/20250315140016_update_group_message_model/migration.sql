/*
  Warnings:

  - A unique constraint covering the columns `[senderId]` on the table `GroupMessage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `GroupMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupMessage" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GroupMessage_senderId_key" ON "GroupMessage"("senderId");

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

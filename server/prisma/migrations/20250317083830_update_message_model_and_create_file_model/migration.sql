/*
  Warnings:

  - You are about to drop the column `file` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "file";

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

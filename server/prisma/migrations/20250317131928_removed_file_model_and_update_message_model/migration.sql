/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "file" TEXT;

-- DropTable
DROP TABLE "File";

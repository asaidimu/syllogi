/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `LoginGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LoginGroup" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "LoginGroup_name_key" ON "LoginGroup"("name");

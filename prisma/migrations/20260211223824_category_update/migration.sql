/*
  Warnings:

  - You are about to drop the column `courseId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_courseId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "courseId";

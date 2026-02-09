/*
  Warnings:

  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- DropIndex
DROP INDEX "User_googleId_key";

-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleId",
ADD COLUMN     "provider" "AuthProvider" NOT NULL DEFAULT 'LOCAL';

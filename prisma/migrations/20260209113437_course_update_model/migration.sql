/*
  Warnings:

  - You are about to drop the `DetailLesson` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_detailLessonId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "DetailLesson";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_detailLessonId_fkey" FOREIGN KEY ("detailLessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

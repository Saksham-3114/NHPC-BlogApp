/*
  Warnings:

  - Made the column `bio` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "designation" TEXT NOT NULL DEFAULT 'No Designation Added',
ALTER COLUMN "bio" SET NOT NULL;

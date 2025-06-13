/*
  Warnings:

  - The `published` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Publish" AS ENUM ('true', 'false', 'reject');

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "published",
ADD COLUMN     "published" "Publish" NOT NULL DEFAULT 'false';

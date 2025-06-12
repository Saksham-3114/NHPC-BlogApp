/*
  Warnings:

  - A unique constraint covering the columns `[postId,authorId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "likes_postId_authorId_key" ON "likes"("postId", "authorId");

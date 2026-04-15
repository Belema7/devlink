-- CreateTable
CREATE TABLE "vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vote_linkId_idx" ON "vote"("linkId");

-- CreateIndex
CREATE INDEX "vote_userId_idx" ON "vote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vote_userId_linkId_key" ON "vote"("userId", "linkId");

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "riotId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_riotId_key" ON "User"("riotId");

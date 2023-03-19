-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nationalID" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "name" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalID_key" ON "User"("nationalID");

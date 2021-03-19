-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255),
    "idNumber" INTEGER,
    "password" VARBIT(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "accountId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts.email_unique" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts.phone_unique" ON "accounts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "profiles.accountId_unique" ON "profiles"("accountId");

-- AddForeignKey
ALTER TABLE "profiles" ADD FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

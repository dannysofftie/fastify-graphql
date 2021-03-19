/*
  Warnings:

  - Made the column `phone` on table `accounts` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserSecurity" ADD COLUMN     "isValid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "passwordHistory" JSONB,
ADD COLUMN     "passwordValidUntil" TIMESTAMP(3);

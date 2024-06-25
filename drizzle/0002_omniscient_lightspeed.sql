ALTER TABLE "users" ADD COLUMN "isTwoFactorEnabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "boolean";
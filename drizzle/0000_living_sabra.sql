DO $$ BEGIN
 CREATE TYPE "public"."userRole" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_confirmation" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp,
	CONSTRAINT "two_factor_token_email_unique" UNIQUE("email"),
	CONSTRAINT "two_factor_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"hashed_password" text NOT NULL,
	"userRole" "userRole" DEFAULT 'user',
	"boolean" boolean DEFAULT false,
	CONSTRAINT "expenses_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp,
	CONSTRAINT "verification_tokens_email_unique" UNIQUE("email"),
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id" ON "two_factor_confirmation" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "two_factor_confirmation_id" ON "expenses" USING btree ("id");
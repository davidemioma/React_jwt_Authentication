CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp,
	CONSTRAINT "password_reset_tokens_email_unique" UNIQUE("email"),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_confirmations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp,
	CONSTRAINT "two_factor_tokens_email_unique" UNIQUE("email"),
	CONSTRAINT "two_factor_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DROP TABLE "two_factor_confirmation";--> statement-breakpoint
DROP TABLE "two_factor_token";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor_confirmations" ADD CONSTRAINT "two_factor_confirmations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "email_change_verification_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"old_email" text NOT NULL,
	"new_email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp,
	CONSTRAINT "email_change_verification_tokens_old_email_unique" UNIQUE("old_email"),
	CONSTRAINT "email_change_verification_tokens_new_email_unique" UNIQUE("new_email"),
	CONSTRAINT "email_change_verification_tokens_token_unique" UNIQUE("token")
);

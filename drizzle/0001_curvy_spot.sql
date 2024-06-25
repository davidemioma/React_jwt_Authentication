CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"hashed_password" text NOT NULL,
	"userRole" "userRole" DEFAULT 'user',
	"boolean" boolean DEFAULT false,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "expenses";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "two_factor_confirmation_id" ON "users" USING btree ("id");
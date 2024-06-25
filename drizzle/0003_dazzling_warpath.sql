DROP INDEX IF EXISTS "user_id";--> statement-breakpoint
DROP INDEX IF EXISTS "two_factor_confirmation_id";--> statement-breakpoint
ALTER TABLE "two_factor_confirmation" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor_confirmation" ADD CONSTRAINT "two_factor_confirmation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

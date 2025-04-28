CREATE TABLE "actors" (
	"id" text PRIMARY KEY NOT NULL,
	"preferredUsername" text NOT NULL,
	"name" text,
	"summary" text,
	"keys" text NOT NULL,
	"domain" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domains" (
	"id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keys" (
	"id" text PRIMARY KEY NOT NULL,
	"private" text,
	"public" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "actors" ADD CONSTRAINT "actors_keys_keys_id_fk" FOREIGN KEY ("keys") REFERENCES "public"."keys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "actors" ADD CONSTRAINT "actors_domain_domains_id_fk" FOREIGN KEY ("domain") REFERENCES "public"."domains"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_actor_actors_id_fk" FOREIGN KEY ("actor") REFERENCES "public"."actors"("id") ON DELETE no action ON UPDATE no action;
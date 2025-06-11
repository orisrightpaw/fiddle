CREATE TYPE "public"."ActivityTypes" AS ENUM('Accept', 'Add', 'Announce', 'Arrive', 'Block', 'Create', 'Delete', 'Dislike', 'Flag', 'Follow', 'Ignore', 'Invite', 'Join', 'Leave', 'Like', 'Listen', 'Move', 'Offer', 'Question', 'Reject', 'Read', 'Remove', 'TentativeReject', 'TentativeAccept', 'Travel', 'Undo', 'Update', 'View');--> statement-breakpoint
CREATE TYPE "public"."ActorTypes" AS ENUM('Application', 'Group', 'Organization', 'Person', 'Service');--> statement-breakpoint
CREATE TABLE "actors" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "ActorTypes" DEFAULT 'Person',
	"preferredUsername" text NOT NULL,
	"name" text,
	"summary" text,
	"keys" text NOT NULL,
	"created" date DEFAULT now() NOT NULL,
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
ALTER TABLE "actors" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "actors" ADD COLUMN "url" text DEFAULT 'https://snep.lol' NOT NULL;--> statement-breakpoint
ALTER TABLE "actors" ADD COLUMN "icon" text;
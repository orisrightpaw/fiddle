ALTER TABLE "files" RENAME COLUMN "name" TO "type";--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "uploaded" SET NOT NULL;
ALTER TABLE "actors" DROP COLUMN "icon";  
ALTER TABLE "actors" ADD COLUMN "icon" uuid;--> statement-breakpoint
ALTER TABLE "actors" ADD CONSTRAINT "actors_icon_files_id_fk" FOREIGN KEY ("icon") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
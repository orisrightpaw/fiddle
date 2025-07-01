CREATE TYPE "public"."ObjectTypes" AS ENUM('Activity', 'Article', 'Audio', 'Collection', 'CollectionPage', 'Relationship', 'Document', 'Event', 'Image', 'IntransitiveActivity', 'Note', 'Object', 'OrderedCollection', 'OrderedCollectionPage', 'Page', 'Place', 'Profile', 'Question', 'Tombstone', 'Video', 'Application', 'Group', 'Organization', 'Person', 'Service');--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"name" text,
	"uploaded" bigint,
	CONSTRAINT "files_id_unique" UNIQUE("id")
);

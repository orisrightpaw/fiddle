import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

/* 
    Actors
*/

export const ActorTypes = t.pgEnum('ActorTypes', [
	'Application',
	'Group',
	'Organization',
	'Person',
	'Service'
]);

export const Actors = table('actors', {
	// https://www.w3.org/TR/activitypub/#actor-objects
	id: t.text().primaryKey(),
	type: ActorTypes().default('Person').notNull(),
	preferredUsername: t.text().notNull(),
	name: t.text(),
	summary: t.text(),
	url: t.text().default('https://snep.lol').notNull(),
	icon: t.text(),
	keys: t
		.text()
		.notNull()
		.references(() => Keys.id),
	created: t.date().notNull().defaultNow(),
	// Fiddle
	domain: t
		.text()
		.notNull()
		.references(() => Domains.id)
});

/* 
    Activities
*/

export const ActivityTypes = t.pgEnum('ActivityTypes', [
	'Accept',
	'Add',
	'Announce',
	'Arrive',
	'Block',
	'Create',
	'Delete',
	'Dislike',
	'Flag',
	'Follow',
	'Ignore',
	'Invite',
	'Join',
	'Leave',
	'Like',
	'Listen',
	'Move',
	'Offer',
	'Question',
	'Reject',
	'Read',
	'Remove',
	'TentativeReject',
	'TentativeAccept',
	'Travel',
	'Undo',
	'Update',
	'View'
]);

/*
    Objects
*/

export const ObjectTypes = t.pgEnum('ObjectTypes', [
	'Activity',
	'Article',
	'Audio',
	'Collection',
	'CollectionPage',
	'Relationship',
	'Document',
	'Event',
	'Image',
	'IntransitiveActivity',
	'Note',
	'Object',
	'OrderedCollection',
	'OrderedCollectionPage',
	'Page',
	'Place',
	'Profile',
	'Question',
	'Tombstone',
	'Video',
	...ActorTypes.enumValues
]);

/*
    Attachments
*/

/*
    Domains
*/

export const Domains = table('domains', {
	id: t.text().primaryKey()
});

/*
    Keys
*/

export const Keys = table('keys', {
	id: t.text().primaryKey(),
	private: t.text(),
	public: t.text().notNull()
});

/*
    Notifications
*/

/*
    Status

    Why not just consolidate Status + Activity into one schema?

    Data fetching! It's very important! It's gotta be fast,
    or else your users will be stuck waiting for their page 
    to load. We can keep a copy of the Activity, and have a 
    Status too, so we can fufill other requests relating
    to the Status, as well. Might not be the best solution.
    I'll probably think of a better one. Maybe not at 1:30 AM.
*/

/*
    Users

    Why not just consolidate User + Actor into one schema?

    Well, Users are going to have a lot more data associated with 
    them compared to Actors. Users have an email, password,  
    sessions, OAuth apps, notifications, password resets, 
    they need to be tied to instance logs, and the list goes 
    on. It's just a bunch of crap that needs to be associated
    with a User, and not an Actor.
*/

export const Users = table('users', {
	id: t.uuid().primaryKey().defaultRandom(),
	actor: t
		.text()
		.notNull()
		.references(() => Actors.id),
	email: t.text().notNull().unique(),
	password: t.text().notNull()
});

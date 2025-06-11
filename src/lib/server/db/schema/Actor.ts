import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { createDomain, Domains, findDomain } from './Domain';
import { createKeys, findKeys, Keys } from './Keys';
import { db } from '..';
import { and, eq } from 'drizzle-orm';

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

interface CreateActorParams {
	id: string;
	type?: (typeof ActorTypes.enumValues)[number];
	preferredUsername: string;
	url: string;
	icon?: string;
	name: string;
	summary: string;
	keys: {
		id: string;
		public?: string;
		private?: string;
	};
	domain: string;
}

interface UpdateActorParams {
	id: string;
	type?: (typeof ActorTypes.enumValues)[number];
	preferredUsername?: string;
	name?: string;
	url?: string;
	icon?: string;
	summary?: string;
	keys?: {
		id: string;
		public?: string;
		private?: string;
	};
}

interface FindActorParams {
	id: string;
}

interface FindActorUADParams {
	username: string;
	domain: string;
}

export async function createActor(params: CreateActorParams) {
	const domain = await findDomain({ id: params.domain });
	if (domain !== false && domain.length === 0) await createDomain({ id: params.domain });

	const keys = await findKeys({ id: params.keys.id });
	if (keys !== false && keys.length === 0)
		await createKeys({
			id: params.keys.id,
			private: params.keys.private,
			public: params.keys.public
		});

	try {
		await db.insert(Actors).values({
			id: params.id,
			preferredUsername: params.preferredUsername,
			name: params.name,
			summary: params.summary,
			url: params.url,
			icon: params.icon,
			keys: params.keys.id,
			domain: params.domain,
			type: params.type || 'Person'
		});

		return true;
	} catch (e) {
		console.log(`!! Database insert failed for table Actors !!`);
		console.log(`Actor.id: ${params.id}`);
		console.log(e);
		return false;
	}
}

export async function findActor(params: FindActorParams) {
	try {
		return await db.select().from(Actors).where(eq(Actors.id, params.id));
	} catch (e) {
		console.log(`!! Database select failed for table Actors !!`);
		console.log(`Actor.id: ${params.id}`);
		console.log(e);
		return false;
	}
}

export async function findActorByUsernameAndDomain(params: FindActorUADParams) {
	try {
		return await db
			.select()
			.from(Actors)
			.where(and(eq(Actors.preferredUsername, params.username), eq(Actors.domain, params.domain)));
	} catch (e) {
		console.log(`!! Database select failed for table Actors !!`);
		console.log(`Actor.preferredUsername: ${params.username} & Actor.domain: ${params.domain}`);
		console.log(e);
		return false;
	}
}

export async function updateActor(params: UpdateActorParams) {
	if (params.keys)
		await db
			.update(Keys)
			.set({
				private: params.keys.private,
				public: params.keys.public
			})
			.where(eq(Keys.id, params.keys.id));

	try {
		await db
			.update(Actors)
			.set({
				name: params.name,
				summary: params.summary,
				type: params.type,
				icon: params.icon,
				url: params.url
			})
			.where(eq(Actors.id, params.id));

		return true;
	} catch (e) {
		console.log(`!! Database update failed for table Actors !!`);
		console.log(`Actor.id: ${params.id}`);
		console.log(e);
		return false;
	}
}

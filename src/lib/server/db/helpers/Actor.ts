import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
// Schemas
import { ActorTypes, Actors, Keys } from '$lib/server/db/schema';
// Helpers
import { createDomain, findDomain } from '$lib/server/db/helpers/Domain';
import { createKeys, findKeys } from '$lib/server/db/helpers/Keys';

interface CreateActorParams {
	id: string;
	type?: (typeof ActorTypes.enumValues)[number];
	preferredUsername: string;
	url: string;
	icon?: string;
	name?: string;
	summary?: string;
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

export function shortenActorTypeURI(uri: string): (typeof ActorTypes.enumValues)[number] {
	switch (uri) {
		case 'https://www.w3.org/ns/activitystreams#Application':
			return 'Application';
		case 'https://www.w3.org/ns/activitystreams#Group':
			return 'Group';
		case 'https://www.w3.org/ns/activitystreams#Organization':
			return 'Organization';
		case 'https://www.w3.org/ns/activitystreams#Person':
			return 'Person';
		case 'https://www.w3.org/ns/activitystreams#Service':
			return 'Service';
		default:
			return 'Person';
	}
}

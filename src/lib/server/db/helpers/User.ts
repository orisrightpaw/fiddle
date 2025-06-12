import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { HOST } from '$lib/server/config';
// Schemas
import { Users } from '$lib/server/db/schema';
// Helpers
import { createActor, findActorByUsernameAndDomain } from '$lib/server/db/helpers/Actor';
import {
	getLocalActorId,
	getLocalProfilePage,
	getLocalActorKeysId
} from '$lib/server/activitypub/util';

interface CreateUserParams {
	username: string;
	email: string;
	password: string;
}

interface FindUserEParams {
	email: string;
}

interface FindUserParams {
	id: string;
}

export async function createUser(params: CreateUserParams) {
	const actor = await findActorByUsernameAndDomain({ username: params.username, domain: HOST });
	if (actor === false || actor.length > 0) return false;

	await createActor({
		id: getLocalActorId(params.username),
		preferredUsername: params.username,
		name: params.username,
		summary: '',
		url: getLocalProfilePage(params.username),
		keys: { id: getLocalActorKeysId(params.username) },
		domain: HOST
	});

	try {
		const [result] = await db
			.insert(Users)
			.values({
				email: params.email,
				password: await Bun.password.hash(params.password),
				actor: getLocalActorId(params.username)
			})
			.returning();

		return result;
	} catch (e) {
		console.log(`!! Database insert failed for table Users !!`);
		console.log(`User.username: ${params.username} & User.email: ${params.email}`);
		console.log(e);
		return false;
	}
}

export async function findUserByEmail(params: FindUserEParams) {
	try {
		return await db.select().from(Users).where(eq(Users.email, params.email));
	} catch (e) {
		console.log(`!! Database select failed for table Users !!`);
		console.log(`User.email: ${params.email}`);
		console.log(e);
		return false;
	}
}

export async function findUser(params: FindUserParams) {
	try {
		return await db.select().from(Users).where(eq(Users.id, params.id));
	} catch (e) {
		console.log(`!! Database select failed for table Users !!`);
		console.log(`User.id: ${params.id}`);
		console.log(e);
		return false;
	}
}

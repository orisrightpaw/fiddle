/*
    Why not just consolidate User + Actor into one schema?

    Well, Users are going to have a lot more data associated with 
    them compared to Actors. Users have an email, password,  
    sessions, OAuth apps, notifications, password resets, 
    they need to be tied to instance logs, and the list goes 
    on. It's just a bunch of crap that needs to be associated
    with a User, and not an Actor.
*/

import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { Actors, createActor, findActorByUsernameAndDomain } from './Actor';
import { HOST } from '../../config';
import { getLocalActorId, getLocalActorKeysId, getLocalProfilePage } from '../../activitypub/util';
import { db } from '..';
import { eq } from 'drizzle-orm';

export const Users = table('users', {
	id: t.uuid().primaryKey().defaultRandom(),
	actor: t
		.text()
		.notNull()
		.references(() => Actors.id),
	email: t.text().notNull().unique(),
	password: t.text().notNull()
});

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

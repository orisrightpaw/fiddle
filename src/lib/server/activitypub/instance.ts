import { expand } from 'jsonld';
import { setTimeout } from 'node:timers/promises';
import { getRequestEvent } from '$app/server';
import { HOST, ORIGIN } from '$lib/server/config';
import { getLocalActorId, getLocalActorKeysId } from '$lib/server/activitypub/util';
import { createActor, findActor, updateActor } from '$lib/server/db/helpers/Actor';
import { findKeys, createKeys } from '$lib/server/db/helpers/Keys';

let INSTANCE_ACTOR_EXISTS = false;
let INSTANCE_ACTOR_CHECK_LOCK = false;
export async function getInstanceActorIds() {
	if (!INSTANCE_ACTOR_EXISTS && !INSTANCE_ACTOR_CHECK_LOCK) {
		INSTANCE_ACTOR_CHECK_LOCK = true;

		const actor = await findActor({ id: getLocalActorId('fiddle') });
		if (!actor || actor.length === 0)
			await createActor({
				id: getLocalActorId('fiddle'),
				preferredUsername: 'fiddle',
				name: 'fiddle',
				summary: 'Fiddle Instance Actor',
				url: ORIGIN,
				keys: { id: getLocalActorKeysId('fiddle') },
				domain: HOST,
				type: 'Application'
			});

		const keys = await findKeys({ id: getLocalActorKeysId('fiddle') });
		if (!keys || keys.length === 0)
			await createKeys({
				id: getLocalActorKeysId('fiddle')
			});

		INSTANCE_ACTOR_EXISTS = true;
		INSTANCE_ACTOR_CHECK_LOCK = false;
	}

	if (INSTANCE_ACTOR_CHECK_LOCK) {
		await setTimeout(100);
		return getInstanceActorIds();
	}

	return { actor: getLocalActorId('fiddle'), keys: getLocalActorKeysId('fiddle') };
}

export async function fetchActorAndSave(id: string, key?: string) {
	const { fetch } = getRequestEvent();

	const [actorDocument] = await fetch(id, {
		headers: {
			Accept: 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
			Signature: `keyid="${key ? key : (await getInstanceActorIds()).keys}"`
		}
	}).then(async (response) => expand(await response.json()));

	const documentId = actorDocument?.['@id'];
	const type = actorDocument?.['@type']?.[0];
	const preferredUsername =
		actorDocument?.['https://www.w3.org/ns/activitystreams#preferredUsername']?.[0]?.['@value'];
	const url = actorDocument?.['https://www.w3.org/ns/activitystreams#url']?.[0]?.['@id'];
	let summary = actorDocument?.['https://www.w3.org/ns/activitystreams#summary']?.[0]?.['@value'];
	let name = actorDocument?.['https://www.w3.org/ns/activitystreams#name']?.[0]?.['@value'];
	let icon =
		actorDocument?.['https://www.w3.org/ns/activitystreams#icon']?.[0]?.[
			'https://www.w3.org/ns/activitystreams#url'
		]?.[0]?.['@id'];

	if (typeof documentId !== 'string') throw new Error("Actor 'id' is invaid.");
	if (typeof type !== 'string') throw new Error("Actor 'type' is invalid.");
	if (typeof preferredUsername !== 'string')
		throw new Error("Actor 'preferredUsername' is invalid.");
	if (typeof url !== 'string') throw new Error("Actor 'url' is invalid.");
	if (typeof summary !== 'string') summary = '';
	if (typeof name !== 'string') name = preferredUsername;
	if (typeof icon !== 'string') icon = '';

	const publicKey = actorDocument?.['https://w3id.org/security#publicKey']?.[0];
	if (typeof publicKey !== 'object')
		throw new Error(`Could not find supported public key at '${id}'.`);

	const keyId = publicKey['@id'];
	const owner = publicKey['https://w3id.org/security#owner']?.[0]?.['@id'];
	const publicKeyPem = publicKey['https://w3id.org/security#publicKeyPem']?.[0]?.['@value'];

	if (typeof keyId !== 'string') throw new Error("Actor 'publicKey.id' is invalid.");
	if (typeof owner !== 'string') throw new Error("Actor 'publicKey.owner' is invalid.");
	if (typeof publicKeyPem !== 'string')
		throw new Error("Actor 'publicKey.publicKeyPem' is invalid.");

	const documentIdUrl = new URL(documentId);

	const actor = {
		id: documentId,
		domain: documentIdUrl.host,
		name,
		url,
		icon,
		preferredUsername,
		summary,
		keys: {
			id: keyId,
			public: publicKeyPem
		}
	};

	const existingActor = await findActor({ id: documentId });
	if (!existingActor || existingActor.length === 0) createActor(actor);
	else updateActor(actor);

	return actor;
}

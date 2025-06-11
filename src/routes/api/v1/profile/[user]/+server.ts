import { getLocalActorId, getLocalProfilePage } from '$lib/server/activitypub/util.js';
import { HOST } from '$lib/server/config.js';
import { findActorByUsernameAndDomain } from '$lib/server/db/schema/Actor.js';
import { findKeys } from '$lib/server/db/schema/Keys.js';
import { streamObject } from '$lib/server/jsonld/index.js';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
	const results = await findActorByUsernameAndDomain({ username: params.user, domain: HOST });
	if (results === false || results.length === 0) return error(404);

	const key = await findKeys({ id: results[0].keys });
	if (key === false || key.length === 0)
		return error(500, `Missing keys for actor: ${results[0].id}`);

	return await streamObject({
		'@id': results[0].id,
		'@type': 'https://www.w3.org/ns/activitystreams#' + results[0].type,
		'https://www.w3.org/ns/activitystreams#preferredUsername': results[0].preferredUsername,
		'https://www.w3.org/ns/activitystreams#url': {
			'@id': getLocalProfilePage(results[0].preferredUsername)
		},
		'http://www.w3.org/ns/ldp#inbox': {
			'@id': getLocalActorId(results[0].preferredUsername) + '/inbox'
		},
		'https://www.w3.org/ns/activitystreams#outbox': {
			'@id': getLocalActorId(results[0].preferredUsername) + '/outbox'
		},
		'https://www.w3.org/ns/activitystreams#following': {
			'@id': getLocalActorId(results[0].preferredUsername) + '/following'
		},
		'https://www.w3.org/ns/activitystreams#followers': {
			'@id': getLocalActorId(results[0].preferredUsername) + '/followers'
		},
		'https://www.w3.org/ns/activitystreams#liked': {
			'@id': getLocalActorId(results[0].preferredUsername) + '/liked'
		},
		'https://www.w3.org/ns/activitystreams#summary': results[0].summary,
		'https://www.w3.org/ns/activitystreams#name': results[0].name,
		'https://w3id.org/security#publicKey': {
			'@id': results[0].keys,
			'https://w3id.org/security#owner': { '@id': results[0].id },
			'https://w3id.org/security#publicKeyPem': key[0].public
		},
		'https://www.w3.org/ns/activitystreams#manuallyApprovesFollowers': true,
		'https://www.w3.org/ns/activitystreams#published': {
			'@type': 'http://www.w3.org/2001/XMLSchema#dateTime',
			'@value': new Date(results[0].created).toISOString()
		},
		'https://www.w3.org/ns/activitystreams#icon': {
			'@type': 'https://www.w3.org/ns/activitystreams#Image',
			'https://www.w3.org/ns/activitystreams#url': { '@id': results[0].icon }
		},
		'https://www.w3.org/ns/activitystreams#image': {
			'@type': 'https://www.w3.org/ns/activitystreams#Image',
			'https://www.w3.org/ns/activitystreams#url': {
				'@id': 'https://dev.snep.lol/img/demo/banners/fortnite.jpg'
			}
		}
	});
}

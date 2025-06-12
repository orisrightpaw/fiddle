import { HOST, ORIGIN } from '$lib/config.server';
import { CONTENT_TYPES } from '$lib/server/activitypub/util.js';
import { findActorByUsernameAndDomain } from '$lib/server/db/helpers/Actor';
import type { Actor } from '$lib/types.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params, request }) {
	if (CONTENT_TYPES.includes(request.headers.get('Accept')!))
		throw redirect(302, `${ORIGIN}/api/v1/profile/${params.user}`);

	const [username, domain] = params.user.split('@');

	let actor: Actor;

	const results = await findActorByUsernameAndDomain({ username, domain: domain || HOST });
	if (results === false || results.length === 0) return error(404);

	actor = {
		name: results[0].name,
		preferredUsername: results[0].preferredUsername,
		domain: results[0].domain,
		summary: results[0].summary,
		icon: results[0].icon
	};

	return { actor };
}

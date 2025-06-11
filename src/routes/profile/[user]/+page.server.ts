import { HOST } from '$lib/server/config.js';
import { findActorByUsernameAndDomain } from '$lib/server/db/schema/Actor.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const [username, domain] = params.user.split('@');

	let actor;

	const results = await findActorByUsernameAndDomain({ username, domain: domain || HOST });
	if (results === false || results.length === 0) return error(404);

	actor = {
		name: results[0].name,
		handle: results[0].preferredUsername,
		summary: results[0].summary,
		icon: results[0].icon
	};

	return { actor };
}

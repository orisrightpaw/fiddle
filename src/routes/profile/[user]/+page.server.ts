import { HOST } from '$lib/server/config';
import { findActorByUsernameAndDomain } from '$lib/server/db/helpers/Actor';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const [username, domain] = params.user.split('@');

	let actor;

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

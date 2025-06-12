import { HOST } from '$lib/config.server';
import { isASRequest } from '$lib/server/activitypub/util.js';
import { findActorByUsernameAndDomain } from '$lib/server/db/helpers/Actor';
import type { Actor } from '$lib/types.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params, request }): Promise<{ actor: Actor }> {
	if (isASRequest(request)) throw redirect(302, '/api/v1/profile/${params.user}');

	const [username, domain] = params.user.split('@');

	const results = await findActorByUsernameAndDomain({ username, domain: domain || HOST });
	if (results === false || results.length === 0) return error(404);

	return {
		actor: {
			name: results[0].name,
			preferredUsername: results[0].preferredUsername,
			domain: results[0].domain,
			summary: results[0].summary,
			icon: results[0].icon
		}
	};
}

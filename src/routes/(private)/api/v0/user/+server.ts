import { findActor } from '$lib/server/db/helpers/Actor';
import { findUser } from '$lib/server/db/helpers/User';
import { expand } from '$lib/server/jsonld';
import { error, json } from '@sveltejs/kit';

export async function GET({ url, fetch, locals }) {
	const href = url.searchParams.get('href') as string;

	const user = await findUser({ id: locals.user.id });
	if (!user || user.length === 0) return error(401, 'Unauthorized');

	const actor = await findActor({ id: user[0].actor });
	if (!actor || actor.length === 0) return error(401, 'Unauthorized');

	const response = await fetch(href, {
		headers: {
			Accept: 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
			Signature: `keyid="${actor[0].keys}"`
		}
	});

	return json(await expand(await response.json()));
}

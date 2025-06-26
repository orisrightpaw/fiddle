import { getInstanceActorIds } from '$lib/server/activitypub/instance';
import { expand } from '$lib/server/jsonld';
import { json } from '@sveltejs/kit';

export async function GET({ url, fetch }) {
	const href = url.searchParams.get('href') as string;
	const { keys } = await getInstanceActorIds();

	const response = await fetch(href, {
		headers: {
			Accept: 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
			Signature: `keyid="${keys}"`
		}
	});

	return json(await expand(await response.json()));
}

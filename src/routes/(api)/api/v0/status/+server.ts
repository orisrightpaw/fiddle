import { fetchActorAndSave } from '$lib/server/activitypub/instance.js';
import { findActor } from '$lib/server/db/helpers/Actor';
import { findUser } from '$lib/server/db/helpers/User';
import { expand } from '$lib/server/jsonld';
import { error, json } from '@sveltejs/kit';
import type { Actor } from '$lib/types.js';
import { getObjectURL } from '$lib/server/storage.js';

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

	const [status] = await expand(await response.json());

	const attributedTo = status['https://www.w3.org/ns/activitystreams#attributedTo']?.[0]?.['@id'];
	let { preferredUsername, name, domain, icon } = await fetchActorAndSave(
		attributedTo,
		actor[0].keys
	);

	const attachment =
		status['https://www.w3.org/ns/activitystreams#attachment']?.[0]?.[
			'https://www.w3.org/ns/activitystreams#url'
		]?.[0]?.['@id'];

	if (icon) icon = getObjectURL(icon);

	const statusData: TemporaryStatusData = {
		id: '0',
		content: status['https://www.w3.org/ns/activitystreams#content']?.[0]?.['@value'],
		actor: { preferredUsername, name, domain, icon },
		image: attachment && {
			src: attachment,
			hidden: false
		}
	};

	return json(statusData);
}

interface TemporaryStatusData {
	id: string;
	actor: Actor;
	content: string;
	image?: {
		src: string;
		hidden: boolean;
	};
}

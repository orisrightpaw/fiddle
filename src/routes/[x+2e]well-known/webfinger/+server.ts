import { getLocalActorId } from '$lib/server/activitypub/util.js';
import { HOST, ORIGIN } from '$lib/server/config';
import { findActorByUsernameAndDomain } from '$lib/server/db/helpers/Actor';
import { error, json } from '@sveltejs/kit';

export async function GET({ url }) {
	const resource = url.searchParams.get('resource');
	if (!resource) throw error(400, 'Bad Request');

	let username;

	if (resource.startsWith('acct')) {
		const [name, domain] = resource.split('@');
		if (domain !== HOST) throw error(400, 'Bad Request');
		username = name.replace('acct:', '');
	} else if (resource.startsWith('http')) {
		try {
			const url = new URL(resource);
			if (url.host !== HOST) throw error(400, 'Bad Request');
			username = url.pathname.replace('/profile/', '');
		} catch (e) {
			throw error(400, 'Bad Request');
		}
	} else throw error(400, 'Bad Request');

	const user = await findActorByUsernameAndDomain({ username, domain: HOST });
	if (user === false || user.length === 0) throw error(404, 'Not Found');

	return json(
		{
			subject: `acct:${user[0].preferredUsername}@${HOST}`,
			aliases: [`${ORIGIN}/profile/${user[0].preferredUsername}`],
			links: [
				{
					rel: 'http://webfinger.net/rel/profile-page',
					type: 'text/html',
					href: `${ORIGIN}/profile/${user[0].preferredUsername}`
				},
				{
					rel: 'self',
					type: 'application/activity+json',
					href: getLocalActorId(user[0].preferredUsername)
				}
				// {
				//     "rel": "http://webfinger.net/rel/avatar",
				//     "type": "image/png",
				//     "href": ""
				// }
			]
		},
		{
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/jrd+json'
			}
		}
	);
}

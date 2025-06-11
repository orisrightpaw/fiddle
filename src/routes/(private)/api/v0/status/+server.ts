import { fetchActorAndSave } from '$lib/server/activitypub/instance.js';
import { HOST } from '$lib/server/config.js';
import { findActor } from '$lib/server/db/schema/Actor';
import { findUser } from '$lib/server/db/schema/User';
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

	const [status] = await expand(await response.json());

	const attributedTo = status['https://www.w3.org/ns/activitystreams#attributedTo']?.[0]?.['@id'];
	const statusActor = await fetchActorAndSave(attributedTo, actor[0].keys);

	const attachment =
		status['https://www.w3.org/ns/activitystreams#attachment']?.[0]?.[
			'https://www.w3.org/ns/activitystreams#url'
		]?.[0]?.['@id'];

	return json({
		id: '0',
		author: {
			name: statusActor.name,
			handle:
				statusActor.preferredUsername +
				(statusActor.domain === HOST ? '' : `@${statusActor.domain}`),
			icon: statusActor.icon
		},
		image: attachment && {
			src: attachment,
			hidden: false
		},
		content: status['https://www.w3.org/ns/activitystreams#content']?.[0]?.['@value']
	});
}

// {
//     "http://ostatus.org#atomUri": [
//       {
//         "@value": "https://c.mhl.gg/users/admin/statuses/114661958016481808",
//       }
//     ],
//     "https://www.w3.org/ns/activitystreams#attachment": [],
//     "https://www.w3.org/ns/activitystreams#attributedTo": [
//       {
//         "@id": "https://c.mhl.gg/users/admin",
//       }
//     ],
//     "https://www.w3.org/ns/activitystreams#cc": [
//       {
//         "@id": "https://c.mhl.gg/users/admin/followers",
//       }, {
//         "@id": "https://fedi.chadthundercock.com/users/chloe",
//       }
//     ],
//     "https://www.w3.org/ns/activitystreams#content": [
//       {
//         "@value": "<p><span class=\"h-card\" translate=\"no\"><a href=\"https://fedi.chadthundercock.com/@chloe\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\">@<span>chloe</span></a></span> Godbless zoomeye</p>",
//       },
//       {
//         "@value": "<p><span class=\"h-card\" translate=\"no\"><a href=\"https://fedi.chadthundercock.com/@chloe\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\">@<span>chloe</span></a></span> Godbless zoomeye</p>",
//         "@language": "en",
//       }
//     ],
//     "http://ostatus.org#conversation": [
//       {
//         "@value": "tag:chadthundercock.com,2025-06-09:objectId=416353:objectType=Conversation",
//       }
//     ],
//     "@id": "https://c.mhl.gg/users/admin/statuses/114661958016481808",
//     "https://www.w3.org/ns/activitystreams#inReplyTo": [
//       {
//         "@id": "https://fedi.chadthundercock.com/users/chloe/statuses/114652063971582063",
//       }
//     ],
//     "http://ostatus.org#inReplyToAtomUri": [
//       {
//         "@value": "https://fedi.chadthundercock.com/users/chloe/statuses/114652063971582063",
//       }
//     ],
//     "https://www.w3.org/ns/activitystreams#likes": [
//       {
//         "@id": "https://c.mhl.gg/users/admin/statuses/114661958016481808/likes",
//         "https://www.w3.org/ns/activitystreams#totalItems": [
//           [Object ...]
//         ],
//         "@type": [ "https://www.w3.org/ns/activitystreams#Collection" ],
//       }
//     ],
//     "https://www.w3.org/ns/activitystreams#published": [
//       {
//         "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
//         "@value": "2025-06-11T00:43:50Z",
//       }
//     ],
//     "https://www.w3.org/ns/activitystreams#replies": [
//       {
//         "https://www.w3.org/ns/activitystreams#first": [
//           [Object ...]
//         ],
//         "@id": "https://c.mhl.gg/users/admin/statuses/114661958016481808/replies",
//         "@type": [ "https://www.w3.org/ns/activitystreams#Collection" ],
//       }
//     ],
//     "https://www.w3.org/ns/activitystreams#sensitive": [
//       {
//         "@value": false,
//       }
//     ],
//     "https://www.w3.org/ns/activitystreams#shares": [
//       {
//         "@id": "https://c.mhl.gg/users/admin/statuses/114661958016481808/shares",
//         "https://www.w3.org/ns/activitystreams#totalItems": [
//           [Object ...]
//         ],
//         "@type": [ "https://www.w3.org/ns/activitystreams#Collection" ],
//       }
//     ],
//     "https://www.w3.org/ns/activitystreams#tag": [
//       {
//         "https://www.w3.org/ns/activitystreams#href": [
//           [Object ...]
//         ],
//         "https://www.w3.org/ns/activitystreams#name": [
//           [Object ...]
//         ],
//         "@type": [ "https://www.w3.org/ns/activitystreams#Mention" ],
//       }
//     ],
//     "https://www.w3.org/ns/activitystreams#to": [
//       {
//         "@id": "https://www.w3.org/ns/activitystreams#Public",
//       }
//     ],
//     "@type": [ "https://www.w3.org/ns/activitystreams#Note" ],
//     "https://www.w3.org/ns/activitystreams#url": [
//       {
//         "@id": "https://c.mhl.gg/@admin/114661958016481808",
//       }
//     ],
//   }

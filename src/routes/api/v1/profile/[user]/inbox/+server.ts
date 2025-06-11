import { CONTENT_TYPES } from '$lib/server/activitypub/util.js';
import { expand } from '$lib/server/jsonld/index.js';
import { error } from '@sveltejs/kit';

export function POST({ request, params }) {
	return new Promise(async (resolve, reject) => {
		if (!CONTENT_TYPES.includes(request.headers.get('Content-Type') || ''))
			return reject(error(400, 'Bad Request'));

		const object = await expand(await request.json()).catch((_: Error) => _);
		if (object instanceof Error) return reject(error(400, 'Bad Request'));
		else resolve(new Response('', { status: 204 }));

		// we can now do whatever
		console.log(object);
	});
}

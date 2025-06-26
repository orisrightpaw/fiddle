import { isASRequest } from '$lib/server/activitypub/util.js';
import { expand } from '$lib/server/jsonld/index.js';
import { error } from '@sveltejs/kit';

function stupidHack(code: number, message: string) {
	try {
		error(code, message);
	} catch (_) {
		return _;
	}
}

export function POST({ request }) {
	return new Promise(async (resolve, reject) => {
		if (!isASRequest(request)) return reject(stupidHack(400, 'Bad Request'));

		const object = await expand(await request.json()).catch((_: Error) => _);
		if (object instanceof Error) return reject(stupidHack(400, 'Bad Request'));
		else resolve(new Response('', { status: 204 }));

		// we can now do whatever
		console.log(object);
	});
}

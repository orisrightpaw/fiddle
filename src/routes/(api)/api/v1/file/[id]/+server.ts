import { findFile } from '$lib/server/db/helpers/File.js';
import { getObject } from '$lib/server/storage.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ params }) {
	if (params.id.length !== 36) return error(404);

	const results = await findFile({ id: params.id });
	if (results === false || results.length === 0) return error(404);

	const stream = getObject({ path: results[0].path });
	if (!stream) return error(404);

	return new Response(stream, { headers: { 'Content-Type': results[0].type } });
}

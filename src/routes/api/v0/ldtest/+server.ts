import { expand } from '$lib/server/jsonld';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const target = url.searchParams.get('target') as string;
	const expanded = await expand(target);

	return json(expanded);
}

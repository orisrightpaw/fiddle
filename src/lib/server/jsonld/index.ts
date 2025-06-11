import * as jsonld from 'jsonld';
import type { JsonLd } from 'jsonld/jsonld-spec';
import { DEFAULT_CONTEXT } from './contexts';
import { json } from '@sveltejs/kit';

export async function expand(document: JsonLd | string) {
	return await jsonld.expand(document);
}

export async function compact(document: object) {
	return await jsonld.compact(document, DEFAULT_CONTEXT['@context']);
}

export async function streamObject(document: object) {
	return json(await compact(document), {
		headers: {
			'Content-Type': 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
		}
	});
}

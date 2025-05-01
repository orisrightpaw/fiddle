import * as jsonld from 'jsonld';

export async function expand(document: string | object) {
	return await jsonld.expand(document);
}

export async function compact() {}

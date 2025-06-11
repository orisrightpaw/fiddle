import { getInstanceActorIds } from '$lib/server/activitypub/instance';
import { CONTENT_TYPES } from '$lib/server/activitypub/util';
import { handleUserAuth } from '$lib/server/auth';
import { draftSign, draftVerify } from '$lib/server/crypto';
import { error } from '@sveltejs/kit';
import { parseDictionary } from 'structured-headers';

export async function handle({ event, resolve }) {
	await handleUserAuth();

	// TODO: THIS IS NOT SAFE can bypass by using a bogus content type
	if (
		CONTENT_TYPES.includes(event.request.headers.get('Content-Type')!) &&
		event.request.url !== (await getInstanceActorIds()).actor
	) {
		const verified = await draftVerify({ request: event.request }).catch((_: Error) => _);
		if (verified instanceof Error) throw error(401, verified.message);
		if (!verified) throw error(401, 'Unauthorized');
	}

	const response = await resolve(event);
	console.log(event.getClientAddress(), response.status, event.request.url);
	return response;
}

export async function handleError({ error, status }) {
	if (status !== 404) console.log(error);
}

export async function handleFetch({ request, fetch }) {
	if (!request.headers.has('Signature')) return fetch(request);
	const dictionary = parseDictionary(request.headers.get('Signature')!);
	const keyid = dictionary.get('keyid')?.[0];
	if (typeof keyid !== 'string') return fetch(request);

	return fetch(await draftSign({ keyid, request }));
}

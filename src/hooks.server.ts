import { getInstanceActorIds } from '$lib/server/activitypub/instance';
import { isASRequest } from '$lib/server/activitypub/util';
import { handleUserAuth } from '$lib/server/auth';
import { draftSign, draftVerify } from '$lib/server/crypto';
import { error } from '@sveltejs/kit';
import { parseDictionary } from 'structured-headers';

export async function handle({ event, resolve }) {
	await handleUserAuth();

	// TODO: THIS IS NOT SAFE. With this method, the downstream route
	// must implement refusal of non-AS requests. Dev forgets? No way
	// to ensure the request is signed! That means unrestricted
	// inbox flow, and inconsistent Signed Fetch!
	if (isASRequest(event.request) && event.request.url !== (await getInstanceActorIds()).actor) {
		const verified = await draftVerify({ request: event.request }).catch((_: Error) => _);
		if (verified instanceof Error) throw error(401, verified.message);
		if (!verified) throw error(401, 'Bad Signature');
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

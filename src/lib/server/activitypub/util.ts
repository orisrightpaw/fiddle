import { ORIGIN } from '../../config.server';

export function getLocalActorId(username: string) {
	return `${ORIGIN}/api/v1/profile/${username}`;
}

export function getLocalActorKeysId(username: string) {
	return `${ORIGIN}/api/v1/profile/${username}#main-key`;
}

export function getLocalProfilePage(username: string) {
	return `${ORIGIN}/profile/${username}`;
}

export const CONTENT_TYPES = [
	'application/activity+json',
	'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
];

/**
 * Is the given request ActivityStream?
 */
export function isASRequest(request: Request) {
	const contentType = request.headers.get('Content-Type')!;
	const accept = request.headers.get('Accept');

	if (CONTENT_TYPES.includes(contentType) && request.method === 'POST') {
		console.log(`Incoming request is AS based on Content-Type '${contentType}'`);
		return true;
	}
	if (accept === null || request.method !== 'GET') return false;

	for (let type of accept.split(',')) {
		if (CONTENT_TYPES.includes(type.trim())) {
			console.log(`Incoming request is AS based on Accept '${accept}'`);
			return true;
		}
	}

	return false;
}

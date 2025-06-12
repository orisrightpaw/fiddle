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
	if (CONTENT_TYPES.includes(contentType)) return true;

	const accept = request.headers.get('Accept');
	if (!accept) return false;
	const acceptedTypes = accept.split(',');

	for (let type of acceptedTypes) {
		if (CONTENT_TYPES.includes(type.trim())) return true;
	}

	return false;
}

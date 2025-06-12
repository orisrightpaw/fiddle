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

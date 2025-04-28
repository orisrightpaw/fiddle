import { ORIGIN } from '../config';

export function getLocalActorId(username: string) {
	return `${ORIGIN}/api/v1/profile/${username}`;
}

export function getLocalActorKeysId(username: string) {
	return `${ORIGIN}/api/v1/profile/${username}#main-key`;
}

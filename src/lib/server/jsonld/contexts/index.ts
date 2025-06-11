import type { JsonLd } from 'jsonld/jsonld-spec';
import ActivityStreams from './ActivityStreams';
import W3IDSecurity from './W3IDSecurity';

export const IRIS = ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'];

export const FIDDLE_EXTENSIONS = {
	'@context': {
		fiddle: 'http://fiddle.snep.lol/ns#'
	}
} satisfies JsonLd;

export const ACTIVITYSTREAMS_EXTENSIONS = {
	'@context': {
		manuallyApprovesFollowers: 'as:manuallyApprovesFollowers'
	}
} satisfies JsonLd;

export const MISSKEY_EXTENSIONS = {
	'@context': {
		misskey: 'https://misskey-hub.net/ns#',
		isCat: 'misskey:isCat'
	}
} satisfies JsonLd;

export const MASTODON_EXTENSIONS = {
	'@context': {
		toot: 'http://joinmastodon.org/ns#',
		Emoji: 'misskey:Emoji'
	}
} satisfies JsonLd;

export const DEFAULT_CONTEXT = {
	'@context': [
		...IRIS,
		{
			...FIDDLE_EXTENSIONS['@context'],
			...ACTIVITYSTREAMS_EXTENSIONS['@context'],
			...MISSKEY_EXTENSIONS['@context'],
			...MASTODON_EXTENSIONS['@context']
		}
	]
} satisfies JsonLd;

export const BAKED_CONTEXTS: Record<string, JsonLd> = {
	'https://www.w3.org/ns/activitystreams': ActivityStreams,
	'https://w3id.org/security/v1': W3IDSecurity
};

import { mimes } from 'mrmime';

export function getExtension(mime: string) {
	return Object.keys(mimes).find((_) => mimes[_] === mime);
}

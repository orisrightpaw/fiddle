import { building } from '$app/environment';

export const ORIGIN = (process.env.ORIGIN as string) || 'http://building.local';
if (!ORIGIN && !building)
	throw new Error(
		'Missing required environment variables. Please set ORIGIN before doing anything.'
	);
export const HOST = new URL(ORIGIN).host;
export const HOST_PROTOCOL = new URL(ORIGIN).protocol.replace(':', '');

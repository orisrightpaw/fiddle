const BUILDING = process.env.DOCKER_ENV === 'building';

export const ORIGIN = BUILDING ? 'http://building.local' : (process.env.ORIGIN as string);
if (!ORIGIN && BUILDING)
	throw new Error(
		'Missing required environment variables. Please set ORIGIN before doing anything.'
	);

export const HOST = new URL(ORIGIN).host;
export const HOST_PROTOCOL = new URL(ORIGIN).protocol.replace(':', '');

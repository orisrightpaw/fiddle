import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import pkg from '../../package.json' with { type: 'json' };

export const ORIGIN = building ? 'http://building.local' : (env.ORIGIN as string);
export const HOST = new URL(ORIGIN).host;

export const VERSION = pkg.version;

export const USER_AGENT = `Fiddle/${VERSION} (${HOST})`;

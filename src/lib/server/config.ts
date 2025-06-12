import pkg from '../../../package.json' with { type: 'json' };

export const BUILDING = process.env.NODE_ENV === 'building';
export const ORIGIN = BUILDING ? 'http://building.local' : (process.env.ORIGIN as string);
export const HOST = new URL(ORIGIN).host;
export const HOST_PROTOCOL = new URL(ORIGIN).protocol.replace(':', '');
export const VERSION = pkg.version;
export const USER_AGENT = `Fiddle/${VERSION} (${HOST})`;
export const PUBLIC_REGISTRATION_ENABLED = process.env.PUBLIC_REGISTRATION_ENABLED === 'true';

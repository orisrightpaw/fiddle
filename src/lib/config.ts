import { building } from '$app/environment';
import { env } from '$env/dynamic/public';

export const TURNSTILE_SITEKEY = env.PUBLIC_TURNSTILE_SITEKEY;

export const JWT_ACCESS_NAME = '.fiddle-access';
export const JWT_REFRESH_NAME = '.fiddle-refresh';

export const REGISTRATION_ENABLED = env.PUBLIC_REGISTRATION_ENABLED === 'true';
export const EMAIL_WHITELIST_ENABLED = env.PUBLIC_REGISTRATION_EMAIL_WHITELIST !== 'false';
export const EMAIL_WHITELIST = building
	? false
	: env.PUBLIC_REGISTRATION_EMAIL_WHITELIST.split(',');

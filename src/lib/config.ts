import { building } from '$app/environment';
import { env } from '$env/dynamic/public';

export const TURNSTILE_SITEKEY = env.PUBLIC_TURNSTILE_SITEKEY;

export const JWT_ACCESS_NAME = '.cadence-access';
export const JWT_REFRESH_NAME = '.cadence-refresh';

export const EMAIL_WHITELIST =
	env.PUBLIC_REGISTRATION_EMAIL_WHITELIST === 'false' || building
		? false
		: env.PUBLIC_REGISTRATION_EMAIL_WHITELIST.split(',');

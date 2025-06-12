import { z } from 'zod';
import { EMAIL_WHITELIST, EMAIL_WHITELIST_ENABLED } from './config';

export const username = z
	.string()
	.max(32)
	.regex(
		/^(?=[A-Za-z0-9])([A-Za-z0-9_]*[A-Z-a-z0-9])?$/,
		'Usernames can only contain A-z, 0-9, and no trailing/leading underscores.'
	);

export const email = z
	.string()
	.email('Invalid email address.')
	.refine(
		(_) => !(EMAIL_WHITELIST_ENABLED && !EMAIL_WHITELIST.includes(_.substring(_.indexOf('@')))),
		'Email is not whitelisted.'
	);

export const password = z.string().min(8, 'Password is too short.').max(1024, 'Dude');

export const register = z.object({
	username,
	email,
	password,
	turnstile: z.string()
});

export const login = z.object({
	email,
	password,
	turnstile: z.string()
});

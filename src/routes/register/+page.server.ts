import { JWT_ACCESS_NAME, JWT_REFRESH_NAME, REGISTRATION_ENABLED } from '$lib/config';
import { createUser } from '$lib/server/db/helpers/User';
import { createAccessToken, createRefreshToken } from '$lib/server/jwt';
import { verify } from '$lib/server/turnstile.js';
import { register } from '$lib/validation.js';
import { fail, redirect } from '@sveltejs/kit';
import { ZodError } from 'zod';

export const actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		const form = await request.formData();
		const body = await register
			.parseAsync({
				username: form.get('username'),
				email: form.get('email'),
				password: form.get('password'),
				turnstile: form.get('cf-turnstile-response')
			})
			.catch((e: ZodError) => e);

		if (body instanceof ZodError) {
			const errors = body.errors.map((_) => ({ key: _.path[0], message: _.message }));
			return fail(400, {
				errors,
				values: {
					username: form.get('username'),
					email: form.get('email')
				}
			});
		}

		const passed = await verify({ turnstile: body.turnstile, remoteIp: getClientAddress() });
		if (!passed)
			return fail(400, {
				errors: [{ key: 'turnstile', message: 'Failed Turnstile verification.' }],
				values: {
					username: form.get('username'),
					email: form.get('email')
				}
			});

		if (!REGISTRATION_ENABLED)
			return fail(500, {
				// THIS IS JUST A TEMPORARY ERROR, GIVE REAL REASON EVENTUALLY
				errors: [{ key: 'username', message: 'Registration rejected by server.' }],
				values: {
					username: form.get('username'),
					email: form.get('email')
				}
			});

		const user = await createUser({
			username: body.username,
			email: body.email,
			password: body.password
		});
		if (!user)
			return fail(500, {
				// THIS IS JUST A TEMPORARY ERROR, GIVE REAL REASON EVENTUALLY
				errors: [{ key: 'username', message: 'Registration rejected by server.' }],
				values: {
					username: form.get('username'),
					email: form.get('email')
				}
			});

		const access = await createAccessToken({ user: user.id });
		const refresh = await createRefreshToken({ user: user.id, version: 0 });

		cookies.set(JWT_ACCESS_NAME, access, {
			sameSite: 'lax',
			expires: new Date(new Date().getTime() + 1000 * 60 * 15),
			path: '/'
		});

		cookies.set(JWT_REFRESH_NAME, refresh, {
			sameSite: 'lax',
			expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
			path: '/'
		});

		throw redirect(302, '/home');
	}
};

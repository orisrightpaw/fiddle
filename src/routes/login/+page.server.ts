import { JWT_ACCESS_NAME, JWT_REFRESH_NAME } from '$lib/config.js';
import { findUserByEmail } from '$lib/server/db/schema/User.js';
import { createAccessToken, createRefreshToken } from '$lib/server/jwt.js';
import { verify } from '$lib/server/turnstile.js';
import { login } from '$lib/validation.js';
import { fail, redirect } from '@sveltejs/kit';
import { ZodError } from 'zod';

export const actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		const form = await request.formData();
		const body = await login
			.parseAsync({
				email: form.get('email'),
				password: form.get('password'),
				turnstile: form.get('cf-turnstile-response')
			})
			.catch((e: ZodError) => e);

		if (body instanceof ZodError) {
			const errors = body.errors.map((_) => ({ key: _.path[0], message: _.message }));
			return fail(400, {
				errors,
				values: { email: form.get('email') }
			});
		}

		const passed = await verify({ turnstile: body.turnstile, remoteIp: getClientAddress() });
		if (!passed)
			return fail(400, {
				errors: [{ key: 'turnstile', message: 'Failed Turnstile verification.' }],
				values: { email: form.get('email') }
			});

		const user = await findUserByEmail({ email: body.email });
		if (user === false || user.length === 0)
			return fail(400, {
				errors: [{ key: 'password', message: 'Incorrect email/password.' }],
				values: { email: form.get('email') }
			});

		const correct = await Bun.password.verify(body.password, user[0].password);
		if (!correct)
			return fail(400, {
				errors: [{ key: 'password', message: 'Incorrect email/password.' }],
				values: { email: form.get('email') }
			});

		const access = await createAccessToken({ user: user[0].id });
		const refresh = await createRefreshToken({ user: user[0].id, version: 0 });

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

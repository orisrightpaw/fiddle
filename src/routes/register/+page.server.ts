import { createUser } from '$lib/server/db/schema/User.js';
import { verify } from '$lib/server/turnstile.js';
import { register } from '$lib/validation.js';
import { fail } from '@sveltejs/kit';
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

		console.log(user);

		return { success: true };
	}
};

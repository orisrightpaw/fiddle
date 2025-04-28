import { env } from '$env/dynamic/private';

export async function verify(params: { turnstile: string; remoteIp: string }): Promise<boolean> {
	let body = new FormData();
	body.append('secret', env.TURNSTILE_SECRETKEY);
	body.append('response', params.turnstile);
	body.append('remoteip', params.remoteIp);

	const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body
	}).catch((_) => ({ json: () => ({ success: false, 'error-codes': ['request-failure'] }) }));

	const outcome = await result.json();

	return outcome.success;
}

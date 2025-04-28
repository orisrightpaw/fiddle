import { JWT_ACCESS_NAME, JWT_REFRESH_NAME } from '$lib/config';
import { createAccessToken, verifyAccessToken, verifyRefreshToken } from '$lib/server/jwt';

export async function handle({ event, resolve }) {
	const accessToken = event.cookies.get(JWT_ACCESS_NAME);
	const refreshToken = event.cookies.get(JWT_REFRESH_NAME);

	let user: null | { id: string } = null;

	if (accessToken) {
		const access = await verifyAccessToken(accessToken).catch((_): false => false);
		if (access === false) event.cookies.delete(JWT_ACCESS_NAME, { path: '/' });
		else user = { id: access.payload.user as string };
	}

	if (refreshToken) {
		const refresh = await verifyRefreshToken(refreshToken).catch((_): false => false);
		if (refresh === false) event.cookies.delete(JWT_REFRESH_NAME, { path: '/' });
		else
			event.cookies.set(
				JWT_ACCESS_NAME,
				await createAccessToken({ user: refresh.payload.user as string }),
				{
					sameSite: 'lax',
					expires: new Date(new Date().getTime() + 1000 * 60 * 15),
					path: '/'
				}
			);
	}

	if (user) event.locals.user = user;

	const response = await resolve(event);
	console.log(event.getClientAddress(), response.status, event.request.url);
	return response;
}

export async function handleError({ error, status }) {
	if (status !== 404) console.log(error);
}

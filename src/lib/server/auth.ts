import { getRequestEvent } from '$app/server';
import { JWT_ACCESS_NAME, JWT_REFRESH_NAME } from '$lib/config';
import { redirect } from '@sveltejs/kit';
import { verifyAccessToken, verifyRefreshToken, createAccessToken } from './jwt';

export async function handleUserAuth() {
	const event = getRequestEvent();

	const accessToken = event.cookies.get(JWT_ACCESS_NAME);
	const refreshToken = event.cookies.get(JWT_REFRESH_NAME);

	if (accessToken) {
		const access = await verifyAccessToken(accessToken).catch((_): false => false);
		if (access === false) event.cookies.delete(JWT_ACCESS_NAME, { path: '/' });
		else event.locals.user = { id: access.payload.user as string };
	}

	if (refreshToken) {
		const refresh = await verifyRefreshToken(refreshToken).catch((_): false => false);
		if (refresh === false) event.cookies.delete(JWT_REFRESH_NAME, { path: '/' });
		else {
			event.cookies.set(
				JWT_ACCESS_NAME,
				await createAccessToken({ user: refresh.payload.user as string }),
				{
					sameSite: 'lax',
					expires: new Date(new Date().getTime() + 1000 * 60 * 15),
					path: '/'
				}
			);

			event.locals.user = { id: refresh.payload.user as string };
		}
	}

	if (!event.locals.user && event.route.id?.includes('(private)')) {
		throw redirect(302, '/');
	}
}

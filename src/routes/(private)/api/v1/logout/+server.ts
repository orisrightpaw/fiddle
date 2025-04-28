import { JWT_ACCESS_NAME, JWT_REFRESH_NAME } from '$lib/config.js';
import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
	cookies.delete(JWT_ACCESS_NAME, { path: '/' });
	cookies.delete(JWT_REFRESH_NAME, { path: '/' });

	throw redirect(302, '/');
}

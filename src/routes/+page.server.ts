import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (locals.user.id) throw redirect(302, '/home');
}

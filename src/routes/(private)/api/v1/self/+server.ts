import { findActor } from '$lib/server/db/schema/Actor.js';
import { findUser } from '$lib/server/db/schema/User.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals }) {
	const user = await findUser({ id: locals.user.id });
	if (user === false) return error(401, 'Unauthorized');

	const actor = await findActor({ id: user[0].actor });
	if (actor === false) return error(401, 'Unauthorized');

	return json({
		name: actor[0].name,
		username: actor[0].preferredUsername,
		email: user[0].email
	});
}

import type { UserStore } from '$lib/client/stores.svelte';
import { HOST } from '$lib/config.server.js';
import { findActor } from '$lib/server/db/helpers/Actor';
import { findUser } from '$lib/server/db/helpers/User';
import { getObjectURL } from '$lib/server/storage.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals, fetch }) {
	if (!locals.user?.id) return error(401, 'Unauthorized');

	const user = await findUser({ id: locals.user?.id });
	if (!user || user.length === 0) return error(401, 'Unauthorized');

	const actor = await findActor({ id: user[0].actor });
	if (!actor || actor.length === 0) return error(401, 'Unauthorized');
	if (actor[0].icon) actor[0].icon = getObjectURL(actor[0].icon);

	const data: NonNullable<UserStore['data']> = {
		name: actor[0].name || actor[0].preferredUsername,
		preferredUsername: actor[0].preferredUsername,
		email: user[0].email,
		domain: HOST,
		icon: actor[0].icon,
		isCat: false
	};

	return json(data);
}

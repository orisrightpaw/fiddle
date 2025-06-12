import { type UserStore } from '$lib/client/stores.svelte';

export async function load({ data, fetch }): Promise<UserStore> {
	if (!data.user) return { state: 'loggedout', data: null };

	const response = await fetch('/api/v1/self');
	if (response.status !== 200) return { state: 'loggedout', data: null };

	const body: NonNullable<UserStore['data']> = await response.json();

	return { state: 'loggedin', data: body };
}

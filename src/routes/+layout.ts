import { user } from '$lib/client/stores.svelte';

export async function load({ data, fetch }) {
	if (data.user) {
		const response = await fetch('/api/v1/self');
		user.authenticated = true;
		user.data = await response.json();
	}
}

<script lang="ts">
	let { children } = $props();

	import { user } from '$lib/client/stores.svelte';
	import HeaderButton from '$lib/components/Buttons/HeaderButton.svelte';
</script>

<div class="flex mx-auto gap-2 min-h-screen w-fit max-w-screen">
	<div class="max-w-7xl px-2 xl:px-0 flex-grow w-screen">
		<div class="bg-zinc-800 rounded-lg my-2 py-2 px-4 flex place-content-between">
			<a href="/home#following" class="text-2xl font-bold text-accent hover:underline">Fiddle</a>
			<div class="my-auto flex gap-3.5">
				{#if user.state === 'loggedin'}
					<HeaderButton href="/home#following" icon="ri-group">Following</HeaderButton>
					<HeaderButton href="/home#local" icon="ri-home-2">Local</HeaderButton>
					<HeaderButton href="/home#global" icon="ri-earth">Global</HeaderButton>
				{:else if user.state === 'loggedout'}
					<HeaderButton href="/login" icon="ri-login-box">Login</HeaderButton>
					<HeaderButton href="/register" icon="ri-user-add">Register</HeaderButton>
				{/if}
			</div>
		</div>
		{@render children()}
	</div>
</div>

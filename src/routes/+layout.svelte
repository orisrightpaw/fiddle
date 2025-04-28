<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { user } from '$lib/client/stores.svelte';

	import HeaderButton from '$lib/components/Buttons/HeaderButton.svelte';
	import LinkButton from '$lib/components/Buttons/LinkButton.svelte';
	import Notification from '$lib/components/Layout/Notification.svelte';
	import UserControlBox from '$lib/components/Layout/UserControlBox.svelte';
</script>

<svelte:head>
	<title>Cadence</title>
	<link rel="stylesheet" href="/css/styles/dark.css" />
	<link rel="preload" href="/css/styles/dark.css" as="style" />
	<link rel="stylesheet" href="/css/remixicon.css" />
	<link rel="preload" href="/css/remixicon.css" as="style" />
</svelte:head>

<div class="flex mx-auto gap-2 min-h-screen w-fit max-w-screen">
	<div class="min-w-sm max-w-xs hidden 2xl:inline">
		<div class="ml-2 sticky top-2">
			{#if user.authenticated}
				<div class="grid gap-2">
					<UserControlBox></UserControlBox>
					{#each Array(0) as _}
						<Notification></Notification>
					{/each}
				</div>
			{:else}
				<div class="bg-zinc-800 rounded-lg p-2">
					<h1 class="font-bold text-white text-xl border-b border-accent/50 pb-0.5">Welcome!</h1>
					<div class="grid gap-1.5 mt-2">
						<LinkButton style="Normal" href="/login">Login</LinkButton>
						<LinkButton style="Primary" href="/register">Register</LinkButton>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<div class="md:max-w-3xl px-2 md:px-0 flex-grow w-screen">
		<div class="bg-zinc-800 rounded-lg my-2 py-2 px-4 flex place-content-between">
			<a href="/home#following" class="text-2xl font-bold text-accent hover:underline">Cadence</a>
			<div class="my-auto flex gap-3.5">
				{#if user.authenticated}
					<HeaderButton href="/home#following" icon="ri-group">Following</HeaderButton>
					<HeaderButton href="/home#local" icon="ri-home-2">Local</HeaderButton>
					<HeaderButton href="/home#global" icon="ri-earth">Global</HeaderButton>
				{:else}
					<HeaderButton href="/login" icon="ri-login-box">Login</HeaderButton>
					<HeaderButton href="/register" icon="ri-user-add">Register</HeaderButton>
				{/if}
			</div>
		</div>
		{@render children()}
	</div>
	<div class="min-w-sm max-w-xs hidden xl:inline">
		<div class="bg-zinc-800 rounded-lg p-2 mr-2 sticky top-2">
			<div class="flex gap-2">
				<img
					class="h-16 aspect-square rounded-sm"
					src="https://coverartarchive.org/release/32b7019a-edbd-4a13-ac70-d25d02fe3be0/33977113606-500.jpg"
					alt=""
				/>
				<div class="my-auto">
					<p class="font-bold text-xl leading-5.5 text-accent line-clamp-1 text-ellipsis">
						minipops 67 (source field mix)
					</p>
					<p class="text-sm line-clamp-1 text-ellipsis">Aphex Twin</p>
				</div>
			</div>
		</div>
	</div>
</div>

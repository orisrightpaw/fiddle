<script lang="ts">
	import { goto } from '$app/navigation';
	import Status from '$lib/components/Status.svelte';

	let postUrl = $state('');
	let userUrl = $state('');
	let disabled = $state(false);
	let statuses: any[] = $state([]);

	async function loadPost() {
		if (disabled) return;
		disabled = true;

		const response = await fetch(`/api/v0/status?href=${postUrl}`);
		const json = await response.json();

		statuses.reverse();
		statuses.push(json);
		statuses.reverse();
		statuses = statuses;

		disabled = false;
	}

	async function loadUser() {
		if (disabled) return;
		disabled = true;

		const response = await fetch(`/api/v0/user?href=${userUrl}`);
		if (response.status !== 200) return (disabled = false);

		const { handle } = await response.json();
		goto('/profile/' + handle);
	}
</script>

<div class="bg-zinc-800 p-3.5 rounded-lg grid gap-2 shadow mb-2">
	<div class="grid">
		<input
			class="bg-zinc-900/65 rounded-t-lg p-2 resize-none"
			type="text"
			name="contentwarning"
			id="contentwarning"
			placeholder="Content Warning (Optional)"
		/>
		<textarea
			class="h-32 bg-zinc-900 rounded-b-lg p-2 resize-none"
			name="compose"
			id="compose"
			placeholder="Start typing here..."
		></textarea>
	</div>
	<div class="flex place-content-between">
		<div class="text-xl flex gap-2">
			<button
				class="h-full aspect-square rounded-md bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
				title="Add Media"
				aria-label="Add Media"
			>
				<i class="ri-image-line"></i>
			</button>
			<button
				class="h-full aspect-square rounded-md bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
				title="Add Poll"
				aria-label="Add Poll"
			>
				<i class="ri-bar-chart-horizontal-line"></i>
			</button>
			<button
				class="h-full aspect-square rounded-md bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
				title="Add Emoji"
				aria-label="Add Emoji"
			>
				<i class="ri-emoji-sticker-line"></i>
			</button>
		</div>
		<div class="flex gap-2">
			<div class="flex">
				<button
					class="h-full text-xl aspect-square rounded-l-md bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
					title="Followers Only"
					aria-label="Followers Only"
				>
					<i class="ri-group-line"></i>
				</button>
				<button
					class="h-full text-xl aspect-square bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
					title="Local Timeline"
					aria-label="Local Timeline"
				>
					<i class="ri-home-2-line"></i>
				</button>
				<button
					class="h-full text-xl aspect-square rounded-r-md bg-accent cursor-pointer"
					title="Global Timeline"
					aria-label="Global Timeline"
				>
					<i class="ri-earth-line"></i>
				</button>
			</div>
			<button class="text-center py-1.5 bg-accent rounded-lg font-bold w-24 cursor-pointer">
				Post
			</button>
		</div>
	</div>
</div>

<div class="flex gap-2">
	<div class="bg-zinc-800 p-3.5 rounded-lg grid gap-2 shadow mb-2 grow">
		<h1 class="text-xl font-bold">Temporary post loader</h1>

		<div class="grid gap-2">
			<input
				class="bg-zinc-900 rounded-lg p-2"
				type="text"
				placeholder="Post URL"
				bind:value={postUrl}
			/>
			<button
				{disabled}
				class="text-center py-1.5 bg-accent rounded-lg font-bold w-24 cursor-pointer text-black disabled:bg-accent/50 disabled:cursor-not-allowed"
				onclick={loadPost}
			>
				Fetch
			</button>
		</div>
	</div>
	<div class="bg-zinc-800 p-3.5 rounded-lg grid gap-2 shadow mb-2 grow">
		<h1 class="text-xl font-bold">Temporary user loader</h1>

		<div class="grid gap-2">
			<input
				class="bg-zinc-900 rounded-lg p-2"
				type="text"
				placeholder="User URL"
				bind:value={userUrl}
			/>
			<button
				{disabled}
				class="text-center py-1.5 bg-accent rounded-lg font-bold w-24 cursor-pointer text-black disabled:bg-accent/50 disabled:cursor-not-allowed"
				onclick={loadUser}
			>
				Fetch
			</button>
		</div>
	</div>
</div>

<div class="grid gap-2">
	{#each statuses as data}
		<Status {data}></Status>
	{/each}
</div>

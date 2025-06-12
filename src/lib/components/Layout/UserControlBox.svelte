<script>
	import { user } from '$lib/client/stores.svelte';
	import ActorImageObject from './ActorImageObject.svelte';
</script>

<div class="bg-zinc-800/50 rounded-lg">
	<div class="bg-zinc-800 rounded-lg p-2">
		{#if user.data}
			<ActorImageObject actor={user.data}></ActorImageObject>
		{:else}
			<h1 class="font-bold text-red-500 text-lg">User store is empty!</h1>
			<p class="text-red-400">Please open a GitHub issue.</p>
		{/if}
	</div>
	<div class="p-2 flex place-content-between text-lg">
		<div>
			<button
				class="w-9 aspect-square rounded-md bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
				title="Sweeney buton"
				aria-label="Sweeney buton"
			>
				<img class="h-6 mx-auto" src="/img/demo/users/tim.jpg" alt="" />
			</button>
		</div>
		<div>
			<a
				href="/api/v1/logout"
				class="w-9 aspect-square rounded-md flex place-items-center bg-zinc-900 hover:bg-red-500/50 cursor-pointer"
				title="Logout"
				aria-label="Logout"
			>
				<i class="ri-logout-box-line mx-auto text-lg"></i>
			</a>
		</div>
	</div>
</div>

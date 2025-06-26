<script lang="ts">
	let { form } = $props();

	import { TURNSTILE_SITEKEY } from '$lib/config';
	import { Turnstile } from 'svelte-turnstile';

	function getErrorByKey(key: string) {
		return form?.errors?.find((_) => _.key === key)?.message;
	}
</script>

{#snippet errorLabel(key: string)}
	{#if getErrorByKey(key)}
		<p class="text-red-400/80 text-xs">
			<i class="ri-error-warning-line"></i>
			{getErrorByKey(key)}
		</p>
	{/if}
{/snippet}

<div class="bg-zinc-800 flex-grow rounded-lg p-3 sm:min-h-[42rem] flex">
	<form class="sm:max-w-sm m-auto grid gap-1.5 grow" method="POST">
		<div class="mb-3">
			<h1 class="text-3xl font-bold text-accent">Account Recovery</h1>
		</div>
		<div class="grid gap-1">
			<label class="text-white font-bold text-lg" for="email">Email Address</label>
			<input
				class="w-full rounded-md bg-zinc-900 px-2 py-1 outline-2 outline-zinc-900/50"
				type="email"
				name="email"
				id="email"
				placeholder="ceo@epicgames.com"
				value={form?.values?.email}
			/>
			{@render errorLabel('email')}
		</div>
		<div class="grid gap-1">
			{@render errorLabel('turnstile')}
			<Turnstile siteKey={TURNSTILE_SITEKEY} size="flexible" theme="dark"></Turnstile>
		</div>
		<button
			class="text-center py-1.5 -mt-1 bg-accent text-zinc-800 rounded-lg font-bold cursor-pointer"
		>
			Reset Password
		</button>
	</form>
</div>

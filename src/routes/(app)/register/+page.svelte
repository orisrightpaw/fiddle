<script lang="ts">
	import { dev } from '$app/environment';
	let { form } = $props();

	import { TURNSTILE_SITEKEY } from '$lib/config';
	import { Turnstile } from 'svelte-turnstile';

	const RULES = [
		{ title: 'Be nice.', content: "I'm not your babysitter, please be mature." },
		{ title: 'No NSFW/L.', content: 'Absolutely no NSFW/L content.' },
		{ title: 'No spam.', content: "This is a test instance. Please don't flood the database." },
		{ title: 'Shhh...', content: 'Lets keep this project a secret for now, alright?' },
		{ title: 'Give feedback!', content: 'Obviously not required, but greatly appreciated!' }
	];

	let acceptedRules = $state(dev || !!form);

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

{#if !acceptedRules}
	<div class="bg-zinc-800 flex-grow rounded-lg p-3 sm:min-h-[42rem] grid">
		<div class="max-w-md mx-auto flex flex-col gap-4 m-auto">
			<div>
				<h1 class="text-center text-2xl font-bold text-accent italic">Hey there!</h1>
				<p class="mx-auto max-w-md text-center">
					Welcome to Fiddle, a music-based social media platform. We have a few rules here, so lets
					get that out of the way first.
				</p>
			</div>
			<div class="grid gap-2">
				{#each RULES as { title, content }, index}
					<div class="flex gap-2">
						<div class="rounded-full bg-accent text-lg text-zinc-800 w-12 h-12 flex shrink-0">
							<p class="m-auto font-bold">{index + 1}.</p>
						</div>
						<div class="grid my-auto">
							<p class="font-bold text-accent leading-4">{title}</p>
							<p>{content}</p>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex place-content-between mt-2 gap-32">
				<a href="/" class="text-center py-1.5 w-full bg-zinc-600 text-white rounded-lg font-bold">
					Decline
				</a>
				<button
					class="text-center py-1.5 w-full bg-accent text-zinc-800 rounded-lg font-bold cursor-pointer"
					onclick={() => {
						acceptedRules = true;
					}}
				>
					Accept
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="bg-zinc-800 flex-grow rounded-lg p-3 sm:min-h-[42rem] flex">
		<form class="sm:max-w-sm m-auto grid gap-1.5 grow" method="POST">
			<div class="mb-3">
				<h1 class="text-3xl font-bold text-accent">Account Registration</h1>
			</div>
			<div class="grid gap-1">
				<label class="text-white font-bold text-lg" for="username">Username</label>
				<input
					class="w-full rounded-md bg-zinc-900 px-2 py-1 outline-2 outline-zinc-900/50"
					type="text"
					name="username"
					id="username"
					placeholder="timsweeney"
					value={form?.values?.username}
				/>
				{@render errorLabel('username')}
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
				<label class="text-white font-bold text-lg" for="password">Password</label>
				<input
					class="w-full rounded-md bg-zinc-900 px-2 py-1 outline-2 outline-zinc-900/50"
					type="password"
					name="password"
					id="password"
					placeholder="••••••••••••••••••••"
				/>
				{@render errorLabel('password')}
			</div>
			<div class="grid gap-1">
				<label class="text-white font-bold text-lg" for="cpassword">Confirm Password</label>
				<input
					class="w-full rounded-md bg-zinc-900 px-2 py-1 outline-2 outline-zinc-900/50"
					type="password"
					id="cpassword"
					placeholder="••••••••••••••••••••"
				/>
				{@render errorLabel('cpassword')}
			</div>
			<div class="grid gap-1">
				{@render errorLabel('turnstile')}
				<Turnstile siteKey={TURNSTILE_SITEKEY} size="flexible" theme="dark"></Turnstile>
			</div>
			<button
				class="text-center py-1.5 -mt-1 bg-accent text-zinc-800 rounded-lg font-bold cursor-pointer"
			>
				Register
			</button>
		</form>
	</div>
{/if}

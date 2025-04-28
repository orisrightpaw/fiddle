<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/client/stores.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (user.authenticated) goto('/home#following');
	});
</script>

<div class="p-3 bg-zinc-800 rounded-lg grid gap-2">
	<div>
		<h1 class="font-bold text-xl">Cadence UI Demo</h1>
		<p>This is just a demo of the planned user interface for Cadence. Design is not final.</p>
	</div>
	<ol class="list-decimal list-inside">
		<li>Click "Login" at the top.</li>
		<li>Click the "Login" button inside the form. You don't have to fill out any information.</li>
		<li>Wow you did it</li>
	</ol>
	<!-- svelte-ignore a11y_media_has_caption -->
	<video src="/video/video.mp4" controls autoplay muted loop></video>
</div>

<script>
</script>

<div class="w-screen h-screen overflow-clip flex">
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		class="absolute h-full w-full m-auto blur object-cover pointer-events-none"
		autoplay
		loop
		tabindex="-1"
		disablepictureinpicture={true}
		src="https://gay.bucket.snep.lol/want.mp4"
	></video>
	<div class="m-auto z-10">
		<h1 class="text-3xl text-accent font-bold">Fiddle</h1>
		<p class="text-xl">Federated music tracking.</p>
		<div class="flex place-content-between">
			<a href="/login" class="group hover:text-accent">
				<i class="ri-login-box-line group-hover:text-accent"></i>
				Login
			</a>
			<a href="/register" class="group hover:text-accent">
				<i class="ri-user-add-line group-hover:text-accent"></i>
				Register
			</a>
		</div>
	</div>
</div>

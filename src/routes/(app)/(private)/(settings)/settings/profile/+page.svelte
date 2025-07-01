<script lang="ts">
	let { data, form } = $props();

	let file: HTMLInputElement;
	let preview: HTMLImageElement;

	const accept = ['image/png', 'image/apng', 'image/gif', 'image/jpeg', 'image/webp'];

	function setFile(event: Event) {
		event.preventDefault();
		file.click();
	}

	function updateFile(event: Event) {
		if (event.target === null) throw new Error('No event target for file picker');

		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = ({ target }) => {
			if (target === null) throw new Error('No event target for FileReader');
			if (target.result === null || typeof target.result !== 'string')
				throw new Error('No result for FileReader');

			preview.src = target.result;
		};

		reader.readAsDataURL(file);
	}
</script>

<form class="grid gap-3" method="POST" enctype="multipart/form-data">
	<div class="flex gap-4">
		<img
			class="rounded-lg aspect-square object-cover h-26"
			src={data.data?.icon}
			alt=""
			bind:this={preview}
		/>
		<div class="my-auto">
			<button
				class="bg-accent py-1.5 font-bold px-2.5 rounded-lg text-black hover:cursor-pointer"
				onclick={setFile}
			>
				Change Avatar
			</button>
			<p class="text-xs text-neutral-400/50 mt-2">Common types, plus animated. 5 MiB max.</p>
		</div>
		<input
			class="appearance-none invisible w-0 h-0"
			type="file"
			name="file"
			bind:this={file}
			onchange={updateFile}
			accept={accept.join(',')}
		/>
	</div>

	<div class="flex gap-2 w-full">
		<div class="grid gap-1 grow">
			<div>
				<label class="text-lg font-bold text-accent" for="name">Display Name</label>
				<p class="text-xs text-neutral-400/50">
					Your display name isn't unique, it can be whatever you want!
				</p>
			</div>
			<input
				class="bg-zinc-900 rounded-lg px-2.5 py-1.5 border border-accent/30 placeholder:text-accent/30 mt-1"
				type="text"
				name="name"
				id="name"
				placeholder="Tim Sweeney"
			/>
		</div>
		<div class="grid gap-1 w-min">
			<div>
				<label class="text-lg font-bold text-accent" for="pronouns">Pronouns</label>
				<p class="text-xs text-neutral-400/50">What the heck are you?!</p>
			</div>
			<input
				class="bg-zinc-900 rounded-lg px-2.5 py-1.5 border border-accent/30 placeholder:text-accent/30 mt-1"
				type="text"
				name="pronouns"
				id="pronouns"
				placeholder="they/them"
			/>
		</div>
	</div>

	<div class="flex gap-4">
		<div class="grid gap-1 grow">
			<div>
				<label class="text-lg font-bold text-accent" for="name">Description</label>
				<p class="text-xs text-neutral-400/50">
					Your description is all about <span class="italic font-bold">you</span>. Your life story,
					favorite recipie, or plans for world domination, it goes here!
				</p>
			</div>
			<textarea
				class="bg-zinc-900 rounded-lg px-2.5 py-1.5 border border-accent/30 placeholder:text-accent/30 mt-1 resize-none h-32"
				name="description"
				id="description"
				placeholder="Use my digital games store!"
			></textarea>
		</div>
	</div>
	<button class="bg-accent py-1.5 font-bold px-2.5 rounded-lg text-black hover:cursor-pointer">
		Update Profile
	</button>
</form>

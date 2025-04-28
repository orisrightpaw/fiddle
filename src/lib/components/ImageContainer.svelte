<script lang="ts">
	// Hella deprecated. This was just to demo ThumbHash.

	import { rgbaToThumbHash, thumbHashToDataURL } from 'thumbhash';

	let props: { src: string; hidden: boolean } = $props();

	// svelte-ignore non_reactive_update
	let canvas: HTMLCanvasElement;
	let visible = $state(!props.hidden);
	function toggleVisibility() {
		visible = !visible;
	}

	$effect(() => {
		const img = new Image();
		img.src = props.src;

		img.addEventListener('load', () => {
			const imageRatio = img.height / img.width;
			canvas.height = imageRatio * canvas.width;

			const renderCanvas = document.createElement('canvas');
			const ctx = renderCanvas.getContext('2d');
			if (!ctx) throw new Error('Failed to get canvas context?');
			const scale = 100 / Math.max(img.width, img.height);
			renderCanvas.width = img.width * scale;
			renderCanvas.height = img.height * scale;

			ctx.drawImage(img, 0, 0, renderCanvas.width, renderCanvas.height);
			const pixels = ctx.getImageData(0, 0, renderCanvas.width, renderCanvas.height);
			const binaryThumbHash = rgbaToThumbHash(pixels.width, pixels.height, pixels.data);
			const blurred = new Image();
			blurred.src = thumbHashToDataURL(binaryThumbHash);

			const ctx2 = canvas.getContext('2d');
			if (!ctx2) throw new Error('Failed to get canvas context?');

			blurred.addEventListener('load', () =>
				ctx2.drawImage(blurred, 0, 0, canvas.width, canvas.height)
			);
		});
	});
</script>

<div class="relative">
	<img class="w-full rounded-lg {visible ? '' : 'hidden'}" src={props.src} alt="example media" />
	<button
		class="absolute top-2 right-2 bg-zinc-800/80 px-4 py-1 rounded-lg cursor-pointer {visible
			? ''
			: 'hidden'}"
		onclick={toggleVisibility}
	>
		Hide
	</button>

	<canvas class="w-full flex bg-zinc-950 rounded-lg {visible ? 'hidden' : ''}" bind:this={canvas}>
	</canvas>
	<button
		class="bg-zinc-900 py-2 px-3 w-42 h-20 rounded-lg cursor-pointer z-10 absolute top-[calc(50%-2.5rem)] left-[calc(50%-5.25rem)] {visible
			? 'hidden'
			: ''}"
		onclick={toggleVisibility}
	>
		<p class="font-bold text-xl text-white">Media Hidden</p>
		<p>Click to show.</p>
	</button>
</div>

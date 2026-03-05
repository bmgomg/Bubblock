<script>
	import GameOver from '$lib/images/Game Over.webp';
	import { fade } from 'svelte/transition';
	import { MAX_STRIKES } from './const';
	import { ss } from './state.svelte';
</script>

{#if !ss.practice && ss.strikes === MAX_STRIKES}
	<div class="go" in:fade>
		<img src={GameOver} alt="" width={150} in:fade />
	</div>
{/if}

<style>
	.go {
		grid-area: 3/1;
		display: grid;
		place-self: center;
		z-index: 1;
		border-radius: 6px;
		rotate: -15deg;
		filter: drop-shadow(0 1px 2px black);
	}
</style>

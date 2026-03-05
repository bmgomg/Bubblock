<script>
	import NumberFlow from '@number-flow/svelte';
	import { ss } from './state.svelte';
</script>

{#if ss.practice}
	<div class="info" tabindex="-1">
		<span>This can be solved</span>
		<div class="line2">
			<span>in</span>
			<div class="flow"><NumberFlow value={ss.steps.length} prefix=" " suffix=" " /></div>
			<span>moves</span>
		</div>
	</div>
{/if}

<style>
	.info {
		grid-area: 1/1 / span 2/1;
		place-self: center;
		display: grid;
		width: 230px;
		justify-items: center;
		font-family: Stencil;
		font-size: 36px;
		color: var(--blue);
		filter: drop-shadow(0 1px 2px black);
	}

	.line2 {
		display: grid;
		grid-auto-flow: column;
		align-items: center;
	}

	.flow {
		color: var(--gold);
	}
</style>

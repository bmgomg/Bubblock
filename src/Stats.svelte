<script>
	import NumberFlow from '@number-flow/svelte';
	import { _stats, ss } from './state.svelte';

	const ave = $derived(_stats.plays ? Math.round(_stats.total / _stats.plays) : 0);
</script>

{#if !ss.practice}
	<div class="stats">
		<span class="label">PLAYS</span>
		<div class="value"><NumberFlow value={_stats.plays} /></div>
		<span></span>
		<span class="label">AVE</span>
		{#if _stats.plays}
			<div class="value"><NumberFlow value={ave} format={{ useGrouping: false }} /></div>
		{:else}
			<div class="bullet">•</div>
		{/if}
		<span></span>
		<span class="label">BEST</span>
		{#if _stats.plays}
			<div class="value"><NumberFlow value={_stats.best} format={{ useGrouping: false }} /></div>
		{:else}
			<span>•</span>
		{/if}
	</div>
{/if}

<style>
	.stats {
		grid-area: 1/1;
		place-self: center;
		font-size: 18px;
		display: grid;
		grid-auto-flow: column;
		align-items: baseline;
		gap: 10px;
		filter: drop-shadow(0 1px 2px black);
	}

	.label {
		color: var(--blue);
	}

	.value {
		color: white;
		font-family: Roboto;
	}
</style>

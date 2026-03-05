<script>
	import NumberFlow from '@number-flow/svelte';
	import { ss } from './state.svelte';
</script>

{#if !ss.practice}
	<div class="scoreboard">
		{#snippet item(value, label, color = 'var(--ow)')}
			<div class="counter" style="color: {color};">
				<div class="flow"><NumberFlow value={value || 0} format={{ useGrouping: false }} /></div>
				<span class="label">{label + (value === 1 ? '' : 's')}</span>
			</div>
		{/snippet}
		{@render item(ss.tasks, 'task')}
		{@render item(ss.points, 'point', ss.points ? 'var(--gold)' : 'var(--ow)')}
		{@render item(ss.strikes, 'strike', ss.strikes ? 'var(--red)' : 'var(--ow)')}
	</div>
{/if}

<style>
	.scoreboard {
		grid-area: 2/1;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 40px;
		font-size: 36px;
	}

	.counter {
		display: grid;
		justify-items: center;
	}

	.flow {
		font-family: Stencil;
		font-size: 48px;
		margin-bottom: -10px;
		filter: drop-shadow(0 1px 2px black);
	}

	.label {
		font-size: 16px;
		filter: drop-shadow(0 1px 1px black);
	}
</style>

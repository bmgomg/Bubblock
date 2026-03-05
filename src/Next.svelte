<script>
	import TextButton from './Text Button.svelte';
	import { isAnimated } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { ss } from './state.svelte';

	const canNext = $derived(!isAnimated() && !ss.surrender);

	const onNext = () => {
		_sound.play('plop');
		ss.swirl = true;
	};
</script>

{#if ss.practice}
	<div class="next">
		<TextButton id="tb-next" text={['NEXT PUZZLE']} disabled={!canNext} onClick={onNext} />
	</div>
{/if}

<style>
	.next {
		grid-area: 5/1;
		place-self: center;
		display: grid;
		font-family: Stencil;
		font-size: 32px;
	}
</style>

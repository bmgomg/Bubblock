<script>
	import { _prompt } from './state.svelte';
	import { post } from './utils';

	const { op } = $props();

	let scale = $state(1);
	const style = $derived(`transform: scale(${scale});`);

	$effect(() => {
		const onTransitionEnd = (e) => {
			if (e.target.id !== op.label) {
				return;
			}

			if (scale < 1) {
				scale = 1;
			} else if (op.onClick) {
				post(() => op.onClick(op.index));
				_prompt.opacity = 0;
			}
		};

		window.addEventListener('transitionend', onTransitionEnd);
		return () => window.removeEventListener('transitionend', onTransitionEnd);
	});
</script>

<div id={op.label} class="button-base no-highlight button" style="{op.style}; {style}" onpointerdown={() => (scale = 0.8)}>
	<div class="label">{op.label}</div>
</div>

<style>
	.button {
		cursor: pointer;
		display: grid;
		font-family: Stencil;
		font-size: 40px;
		filter: drop-shadow(0 1px 2px black);
	}

	.button:hover {
		color: var(--white);
	}

	.label {
		grid-area: 1/1;
	}
</style>

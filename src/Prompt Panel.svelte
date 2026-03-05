<script>
	import PromptButton from './Prompt Button.svelte';

	const { ops, style, readOnly = false } = $props();
</script>

<div class="prompt-panel {readOnly ? 'read-only' : ''}" {style}>
	{#each ops as op, i (i)}
		<PromptButton {op} />
	{/each}
</div>

<style>
	.prompt-panel {
		display: grid;
		grid-auto-flow: column;
		gap: 25px;
	}

	.read-only {
		pointer-events: none;
	}
</style>

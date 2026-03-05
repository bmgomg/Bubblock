<script>
	import { PROMPT_NO, PROMPT_PLAY_AGAIN, PROMPT_RESET_STATS } from './const';
	import PromptPanel from './Prompt Panel.svelte';
	import { isSolved, persist } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { _prompt, _stats, ss } from './state.svelte';
	import { post } from './utils';

	const label = $derived(_prompt.id);

	$effect(() => {
		const onTransitionEnd = (e) => {
			const id = e.target.id;

			if (id !== 'prompt') {
				return false;
			}

			if (e.propertyName !== 'opacity') {
				return;
			}

			if (_prompt.opacity === 0) {
				_prompt.id = null;
			}

			if (!ss.practice && ss.over && !ss.home && (_prompt.opacity == 0 || !_prompt.id) && !ss.levelPrompt && !ss.swirl) {
				_prompt.set(ss.over && !ss.flip ? PROMPT_PLAY_AGAIN : null);
			}
		};

		window.addEventListener('transitionend', onTransitionEnd);
		return () => window.removeEventListener('transitionend', onTransitionEnd);
	});

	const resetStats = () => {
		_sound.play('link1', { rate: 0.7 });

		_stats.plays = 0;
		_stats.total = 0;
		_stats.best = 0;

		persist();
	};

	const onResetStats = (yes = false) => {
		_sound.play('plop');

		if (yes) {
			resetStats();
		}

		if (isSolved()) {
			post(() => _prompt.set(PROMPT_PLAY_AGAIN), 500);
		}
	};

const onPlayAgain = () => {
	_sound.play('plop');

	ss.level = 1;
    ss.tasks = 0;
    ss.points = 0;
    ss.strikes = 0;
	ss.swirl = true;
	delete ss.fail;
};

	const style = `font-size: ${28}px;`;
</script>

<div id="prompt" class="prompt {_prompt.opacity ? 'visible' : ''}">
	{#if label === PROMPT_PLAY_AGAIN}
		<PromptPanel ops={[{ label, onClick: onPlayAgain }]} />
	{:else if label === PROMPT_RESET_STATS}
		<PromptPanel
			ops={[
				{ label, onClick: () => onResetStats(true) },
				{ label: PROMPT_NO, onClick: onResetStats }
			]}
		/>
	{:else if label}
		<PromptPanel ops={[{ label, style }]} />
	{/if}
</div>

<style>
	.prompt {
		grid-area: 5/1;
		place-self: start center;
		transform: scale(0);
		opacity: 0;
		z-index: 1;
		transition: 0.3s;
		height: 52px;
		place-content: center;
	}

	.visible {
		opacity: 1;
		transform: scale(1);
	}
</style>

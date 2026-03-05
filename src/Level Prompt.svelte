<script>
	import { sample } from 'lodash-es';
	import { fade } from 'svelte/transition';
	import { CELL_MARGIN, CELL_SIZE, LEVELS, SIZE } from './const';
	import { onStart } from './shared.svelte';
	import { _prompt, ss } from './state.svelte';
	import TextButton from './Text Button.svelte';

	const ul = '<ul style="margin: 15px 0 0 0;">';
	const li = '<li style="margin: 10px 0 0 -20px;">';
	const hi = '<span style="color: var(--gold);">';

	const L1 = `
        ${ul}
        ${li}You have ${hi}${LEVELS[0].secs} seconds</span> to solve each puzzle.</li>
        ${li}If you run ${hi}out of time</span>, you earn a ${hi}strike</span>.</li>
        ${li}Three strikes end the game.</li>
        ${li}Complete ${hi}10 tasks</span> to advance to the next level.</li>
        </ul>`;

	const L2 = `
		<span>So far so good!</span>
        ${ul}
        ${li}Your strike count has been reset</span>.</li>
        ${li}You still have ${hi}${LEVELS[0].secs} seconds</span> to solve each puzzle.</li>
        </ul>`;

	const L3 = `
		<span>Great!</span>
        ${ul}
        ${li}Your strike count has been reset</span>.</li>
        ${li}You still have ${hi}${LEVELS[0].secs} seconds</span> to solve each puzzle.</li>
        </ul>`;

	const L4 = `
		<span>Excellent!</span>
        ${ul}
        ${li}Your strike count has been reset</span>.</li>
        ${li}You now have only ${hi}${LEVELS[3].secs} seconds</span> to solve each puzzle.</li>
        </ul>`;

	const CHEERS = ['Phenomenal!', 'Amazing!', 'Incredible!', 'Unbelievable!', 'Fantastic!', 'Astounding!', 'Extraordinary!', 'Sensational!'];

	const L5 = $derived(`
		<span>${ss.level > LEVELS.length ? sample(CHEERS) : 'Impressive!'}</span>
        ${ul}
        ${li}Your strike count has been reset</span>.</li>
        ${li}You ${ss.level > LEVELS.length ? 'still have' : 'now have only'} ${hi}${LEVELS[4].secs} seconds</span> to solve each puzzle.</li>
        </ul>`);

	const CONTENTS = $derived([L1, L2, L3, L4, L5]);

	const onClick = () => {
		onStart(ss.ticks ? 'plop' : 'dice');
		delete ss.levelPrompt;
	};
</script>

{#if !ss.practice && ss.levelPrompt}
	<div class="level-prompt" style="height: {(CELL_SIZE + CELL_MARGIN * 2) * SIZE + 84}px;" in:fade>
		{#if ss.ticks}
			<span class="in-progress" tabindex="-1">GAME IN PROGRESS</span>
		{:else}
			<div class="content" tabindex="-1">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html CONTENTS[Math.min(ss.level, LEVELS.length) - 1]}
			</div>
		{/if}
		<div class="button {_prompt.opacity ? 'hidden' : ''}">
			<TextButton id="level-prompt" text={[ss.ticks ? 'RESUME' : ss.level > 1 ? 'CONTINUE' : 'START']} {onClick} />
		</div>
	</div>
{/if}

<style>
	.level-prompt {
		grid-area: 3/1 / span 2/1;
		display: grid;
		place-self: center;
		place-content: center;
		gap: 50px;
	}

	.content {
		display: grid;
		align-content: start;
		width: 340px;
		font-weight: bold;
		font-size: 19px;
		color: var(--blue);
		filter: drop-shadow(0 1px 1px black);
	}

	.in-progress {
		display: grid;
		align-content: center;
		font-family: Stencil;
		font-size: 36px;
		color: var(--blue);
		filter: drop-shadow(0 1px 2px black);
	}

	.button {
		font-family: Stencil;
		font-size: 40px;
		transition: opacity 0.3s;
		filter: drop-shadow(0 1px 1px black);
	}

	.hidden {
		opacity: 0;
		pointer-events: none;
	}
</style>

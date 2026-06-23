<script lang="ts">
	import Popover from '$lib/cmp/popover.svelte';

	interface Props {
		show: boolean;
		currentVote: number;
		currentRates: number;
		starLocked: boolean;
		hoverStar: number;
		onstar: (n: number) => void;
		onstarhover: (n: number) => void;
		onstarleave: () => void;
		onemote: (key: string) => void;
	}

	let {
		show,
		currentVote,
		currentRates,
		starLocked,
		hoverStar,
		onstar,
		onstarhover,
		onstarleave,
		onemote,
	}: Props = $props();

	const emotes = [
		{ key: 'like',  emoji: '👍', cost: 1 },
		{ key: 'love',  emoji: '❤️', cost: 3 },
		{ key: 'laugh', emoji: '😂', cost: 1 },
		{ key: 'cool',  emoji: '😎', cost: 2 },
		{ key: 'fire',  emoji: '🔥', cost: 3 },
		{ key: 'clap',  emoji: '👏', cost: 2 },
		{ key: 'cry',   emoji: '😢', cost: 2 },
		{ key: 'wow',   emoji: '😮', cost: 3 },
	];
</script>

<Popover position="bottom" {show}>
	<!-- star rating -->
	<div class="flex items-center justify-center gap-0.5 px-2.5 py-2">
		{#each [1, 2, 3, 4, 5] as n}
			<button
				onclick={() => onstar(n)}
				onmouseenter={() => onstarhover(n)}
				onmouseleave={onstarleave}
				disabled={starLocked || currentVote !== 1}
				class="p-0.5 transition disabled:cursor-default"
				aria-label="Rate {n} star{n === 1 ? '' : 's'}"
			>
				<svg
					class="h-5 w-5 transition-colors
						{hoverStar > 0
							? n <= hoverStar
								? 'text-amber-300 dark:text-amber-500/60'
								: 'text-gray-300 dark:text-gray-600'
							: n <= currentRates
								? 'text-amber-400 dark:text-amber-300'
								: 'text-gray-300 dark:text-gray-600'}"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			</button>
		{/each}
	</div>

	<div class="border-t border-gray-100 dark:border-gray-700"></div>

	<!-- emotes — paid reactions with merit cost -->
	<div class="px-1.5 py-2">
		<div class="grid grid-cols-4 gap-1">
			{#each emotes as emote}
				<button
					onclick={() => onemote(emote.key)}
					class="flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 active:scale-95"
					aria-label="{emote.key} ({emote.cost} merit)"
				>
					<span class="text-base leading-none">{emote.emoji}</span>
					<span class="text-[9px] font-medium text-amber-600 dark:text-amber-400 tabular-nums">{emote.cost}m</span>
				</button>
			{/each}
		</div>
	</div>
</Popover>

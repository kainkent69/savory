<script lang="ts">
	import Emote from '$lib/cmp/feed/emote.svelte';
	import chevron_left from '$lib/assets/chevron_left.svg?raw';
	import chevron_right from '$lib/assets/chevron_right.svg?raw';
	import chevron_up from '$lib/assets/chevron_up.svg?raw';
	import chevron_down from '$lib/assets/chevron_down.svg?raw';
	import comment_icon from '$lib/assets/comment.svg?raw';

	interface Props {
		comment: TComment;
		engagements: { up: number; down: number };
		hasPrev: boolean;
		hasNext: boolean;
		replying: boolean;
		ontoggle_reply: () => void;
		ongoprev: () => void;
		ongonext: () => void;
	}

	let {
		comment, engagements, hasPrev, hasNext, replying,
		ontoggle_reply, ongoprev, ongonext
	}: Props = $props();

	let currentVote = $state(0);
	let currentRates = $state(0);
	let collectedEmotes = $state<string[]>([]);

	function setVote(v: 0 | 1 | 2) {
		if (currentVote === v) {
			currentVote = 0;
		} else {
			currentVote = v;
		}
	}

	function fmt(n: number): string {
		if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
		if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
		return String(n);
	}

	let upCount = $derived(engagements.up + (currentVote === 1 ? 1 : 0));
	let downCount = $derived(engagements.down + (currentVote === 2 ? 1 : 0));
</script>

<div class="mt-2 flex items-center justify-between">
	<div class="flex items-center gap-0.5">
		<!-- upvote -->
		<button
			onclick={() => setVote(1)}
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition select-none
				{currentVote === 1
					? 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30'
					: 'text-gray-500 dark:text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30'}"
			aria-label="Upvote"
		>
			<span class="icon h-4 w-4">{@html chevron_up}</span>
			<span>{fmt(upCount)}</span>
		</button>

		<!-- downvote -->
		<button
			onclick={() => setVote(2)}
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition select-none
				{currentVote === 2
					? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
					: 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'}"
			aria-label="Downvote"
		>
			<span class="icon h-4 w-4">{@html chevron_down}</span>
			<span>{fmt(downCount)}</span>
		</button>

		<!-- emote -->
		<Emote bind:currentRates bind:collectedEmotes />

		<!-- reply -->
		<button
			onclick={ontoggle_reply}
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition select-none
				{replying
					? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
					: 'text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'}"
			aria-label="Reply"
		>
			<span class="icon h-4 w-4">{@html comment_icon}</span>
			Reply
		</button>

		<!-- prev / next -->
		{#if comment.level > 0}
			<button
				onclick={ongoprev} disabled={!hasPrev}
				class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition disabled:opacity-20 disabled:pointer-events-none"
				aria-label="Previous comment"
			>
				<span class="icon h-4 w-4">{@html chevron_left}</span>
			</button>
			<button
				onclick={ongonext} disabled={!hasNext}
				class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition disabled:opacity-20 disabled:pointer-events-none"
				aria-label="Next comment"
			>
				<span class="icon h-4 w-4">{@html chevron_right}</span>
			</button>
		{/if}
	</div>
</div>

<script lang="ts">
	import { comment, repost, pin } from '$lib/assets/icons/index';
	import { type Post, type Votes } from '$lib/scripts/feed';
	import { onDestroy } from 'svelte';
	import Popover from '$lib/cmp/popover.svelte';
	import { post as postQuery } from '$lib/../state';

	interface Props {
		post: Post;
		votes: Votes;
		commentCount?: number;
		mostRelevant?: TComment;
	}

	let { post, votes, commentCount = 0, mostRelevant }: Props = $props();

	let opened = $state(false);
	const unsub = postQuery.subscribe(v => { opened = v === String(post.id); });
	onDestroy(() => unsub());

	// ── interactive state ──

	let currentVote = $state(votes.vote);   // 0=none, 1=up, 2=down
	let currentRates = $state(votes.rates); // 0–5
	let currentEmote = $state<string | null>(null); // selected emote key
	let pinned = $state(false);
	let showPopover = $state(false);        // long-press override

	let showStarRating = $derived(currentVote === 1);

	// ── long-press detection ──

	let pressTimer: ReturnType<typeof setTimeout> | null = null;

	function startPress() {
		pressTimer = setTimeout(() => {
			showPopover = true;
		}, 300);
	}

	function cancelPress() {
		if (pressTimer) {
			clearTimeout(pressTimer);
			pressTimer = null;
		}
	}

	// ── vote handlers ──

	function setVote(v: 0 | 1 | 2) {
		currentVote = currentVote === v ? 0 : v;
		if (currentVote !== 1) {
			currentRates = 0;
			currentEmote = null;
			starLocked = false;
			if (starTimer) { clearTimeout(starTimer); starTimer = null; }
		}
		showPopover = false;
	}

	function togglePin() {
		pinned = !pinned;
		showPopover = false;
	}

	let starLocked = $state(false);   // true after 5s grace window
	let starTimer: ReturnType<typeof setTimeout> | null = null;
	let hoverStar = $state(0);        // hover preview (0 = none)

	function setStar(n: number) {
		if (currentVote !== 1 || starLocked) return;
		if (n < currentRates) return; // can only increase, never decrease
		currentRates = n;
		// reset 5s grace window on each click
		if (starTimer) clearTimeout(starTimer);
		starTimer = setTimeout(() => {
			starLocked = true;
		}, 5000);
	}

	// ── emotes ──

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

	function applyEmote(key: string) {
		const emote = emotes.find(e => e.key === key);
		currentVote = 1;                  // emotes count as upvote
		currentEmote = key;
		currentRates = emote?.cost ?? 1;  // stars = emote cost
		// start lock timer
		if (starTimer) clearTimeout(starTimer);
		starTimer = setTimeout(() => { starLocked = true; }, 5000);
		showPopover = false;
	}

	// ── derived ──

	let engagements = $derived(post.merits + post.emotes + commentCount);
	let emoteEmoji = $derived(emotes.find(e => e.key === currentEmote)?.emoji ?? '');

	function fmt(n: number): string {
		if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
		if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
		return String(n);
	}
</script>

<!-- action row -->
<div class="mt-2.5 -ml-1 flex items-center justify-between max-w-lg">
	<!-- left cluster: upvote | comments | repost | pin -->
	<div class="flex items-center gap-0.5">
		<!-- upvote with popover (hover + long-press) -->
		<div class="group relative">
			<button
				onclick={() => setVote(1)}
				onpointerdown={startPress}
				onpointerup={cancelPress}
				onpointerleave={cancelPress}
				class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition select-none
					{currentVote === 1
						? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
						: 'text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'}"
				aria-label={currentEmote ? currentEmote : 'Upvote'}
			>
				{#if currentEmote}
					<span class="text-base leading-none">{emoteEmoji}</span>
				{:else}
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
					</svg>
				{/if}
			</button>

			<Popover position="bottom" show={showPopover}>
				<!-- star rating (always visible in popover) -->
				<div class="flex items-center justify-center gap-0.5 px-2.5 py-2">
					{#each [1, 2, 3, 4, 5] as n}
						<button
							onclick={() => setStar(n)}
							onmouseenter={() => { if (!starLocked && currentVote === 1) hoverStar = n; }}
							onmouseleave={() => { hoverStar = 0; }}
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
								onclick={() => applyEmote(emote.key)}
								class="flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 active:scale-95"
								aria-label="{emote.key} ({emote.cost} merit)"
							>
								<span class="text-base leading-none">{emote.emoji}</span>
								<span class="text-[9px] font-medium text-amber-600 dark:text-amber-400 tabular-nums">{emote.cost}m</span>
							</button>
						{/each}
					</div>
			</Popover>
		</div>

		<!-- downvote (standalone icon, no popover) -->
		<button
			onclick={() => setVote(2)}
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition select-none
				{currentVote === 2
					? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
					: 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'}"
			aria-label="Downvote"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<!-- comments -->
		<button
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
			aria-label="Comments"
		>
			<span class="icon h-4 w-4">{@html comment}</span>
			{#if commentCount > 0}
				<span>{fmt(commentCount)}</span>
			{/if}
		</button>

		<!-- repost -->
		<button
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 transition"
			aria-label="Repost"
		>
			<span class="icon h-4 w-4">{@html repost}</span>
		</button>

		<!-- pin -->
		<button
			onclick={togglePin}
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition
				{pinned
					? 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30'
					: 'text-gray-500 dark:text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30'}"
			aria-label="Pin"
		>
			<span class="icon h-4 w-4">{@html pin}</span>
		</button>
	</div>

	<!-- emote + stars + views -->
	<span class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 tabular-nums">
		{#if currentEmote}
			<span class="text-base leading-none">{emoteEmoji}</span>
		{/if}
		<span class="flex items-center gap-0.5 font-medium text-amber-500 dark:text-amber-400">
			<span>{fmt(post.merits)}</span>
			{#if currentRates > 0}
				<span class="text-amber-400 dark:text-amber-400/70">(+{currentRates})</span>
			{/if}
			<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		</span>
		<span>·</span>
		<span>{fmt(engagements)} views</span>
	</span>
</div>

<!-- long-press backdrop -->
{#if showPopover}
	<button class="fixed inset-0 z-30 cursor-default" onclick={() => showPopover = false} aria-label="Dismiss popover"></button>
{/if}

<!-- comment preview (hidden when post is opened) -->
{#if mostRelevant && !opened}
	<div class="mt-2.5 rounded-lg bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 px-3 py-2">
		<p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
			<span class="font-medium text-gray-500 dark:text-gray-500">{mostRelevant.poster}</span>
			<span class="text-gray-300 dark:text-gray-600 mx-1">·</span>
			{mostRelevant.comment}
		</p>
	</div>
{:else if commentCount > 0 && !opened}
	<div class="mt-2.5 rounded-lg bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 px-3 py-2">
		<p class="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 italic">
			View {commentCount} comment{commentCount === 1 ? '' : 's'}
		</p>
	</div>
{/if}


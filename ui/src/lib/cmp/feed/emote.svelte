<script lang="ts">
	import Popover from '$lib/cmp/popover.svelte';

	const tiers = [
		{ type: 'star', level: 1, cost: 1, label: '1★' },
		{ type: 'star', level: 2, cost: 2, label: '2★' },
		{ type: 'star', level: 3, cost: 3, label: '3★' },
		{ type: 'star', level: 4, cost: 4, label: '4★' },
		{ type: 'star', level: 5, cost: 5, label: '5★' },
		{ type: 'emote', key: 'eagle', emoji: '🦅', cost: 10, label: 'Eagle' },
		{ type: 'emote', key: 'dragon', emoji: '🐉', cost: 25, label: 'Dragon' },
		{ type: 'emote', key: 'unicorn', emoji: '🦄', cost: 50, label: 'Unicorn' },
		{ type: 'emote', key: 'crown', emoji: '👑', cost: 100, label: 'Crown' },
		{ type: 'emote', key: 'phoenix', emoji: '🔥', cost: 250, label: 'Phoenix' },
		{ type: 'emote', key: 'supernova', emoji: '🌟', cost: 500, label: 'Supernova' },
	];

	interface Props {
		currentRates: number;
		collectedEmotes: string[];
	}

	let { currentRates = $bindable(0), collectedEmotes = $bindable([]) }: Props = $props();

	let showPopover = $state(false);
	let hoverStar = $state(0);
	let confirming = $state<{ type: 'star', level: number } | { type: 'emote', key: string } | null>(null);

	let emoteTiers = $derived(tiers.filter((t) => t.type === 'emote'));
	let displayEmotes = $derived(collectedEmotes.slice(0, 3));
	let extraCount = $derived(Math.max(0, collectedEmotes.length - 3));
	let anyActive = $derived(currentRates > 0 || collectedEmotes.length > 0);

	let confirmData = $derived.by(() => {
		const c = confirming
		if (!c) return null
		if (c.type === 'star') return { emoji: '⭐', label: `${c.level}★`, cost: c.level }
		const t = (emoteTiers as any).find((t: any) => t.key === c.key)
		return t ? { emoji: t.emoji, label: t.label, cost: t.cost } : null
	})

	function requestStar(level: number) {
		if (level <= currentRates) return;
		confirming = { type: 'star', level };
	}

	function requestEmote(key: string) {
		if (collectedEmotes.includes(key)) return;
		confirming = { type: 'emote', key };
	}

	function confirm() {
		if (!confirming) return;
		if (confirming.type === 'star') {
			currentRates = confirming.level;
		} else {
			collectedEmotes = [...collectedEmotes, confirming.key];
		}
		confirming = null;
		showPopover = false;
	}

	function cancel() {
		confirming = null;
	}
</script>

<div class="group relative inline-flex items-center">
	<button
		onclick={() => { showPopover = !showPopover; confirming = null; }}
		class="flex items-center rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
	>
		{#if anyActive}
			{#if currentRates > 0}
				<span class="relative z-10 inline-flex items-center justify-center">
					<svg viewBox="0 0 24 24" class="h-7 w-7 fill-yellow-400">
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
					</svg>
					<span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-sm">{currentRates}</span>
				</span>
			{/if}
			{#each displayEmotes as key, i}
				{@const tier = emoteTiers.find((t) => t.key === key)}
				{#if tier}
					<span class="-ml-2.5 inline-flex items-center justify-center text-lg">{tier.emoji}</span>
				{/if}
			{/each}
			{#if extraCount > 0}
				<span class="-ml-2.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-200 px-1 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300 z-0">+{extraCount}</span>
			{/if}
		{:else}
			<span class="inline-flex h-8 w-8 items-center justify-center">
				<svg viewBox="0 0 24 24" class="h-5 w-5 fill-none stroke-gray-400 dark:stroke-gray-500">
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
				</svg>
			</span>
		{/if}
	</button>

	<Popover position="bottom" show={showPopover}>
		<div class="w-64 space-y-3 p-3">
			{#if confirming}
				<div class="flex flex-col items-center gap-3 py-2">
					<p class="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{confirming?.type === 'emote' ? 'Emote' : 'Star'}</p>
					<span class="text-4xl animate-[wiggle_500ms_ease-in-out]">{confirming?.type === 'star' ? '⭐' : confirmData!.emoji}</span>
					{#if currentRates > 0}
						<span class="text-xs text-amber-500 font-medium">x {currentRates}★</span>
					{/if}
					<span class="text-[11px] text-gray-400 dark:text-gray-500">{confirmData!.label} — {confirmData!.cost} merit</span>
					<div class="flex items-center gap-2 mt-1">
						<button onclick={confirm} class="rounded-full bg-blue-600 px-4 py-1 text-[11px] font-medium text-white hover:bg-blue-700 transition">Okay</button>
						<button onclick={cancel} class="rounded-full px-3 py-1 text-[11px] text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition">Cancel</button>
					</div>
				</div>
			{:else}
				<div class="flex items-center justify-center gap-1">
					{#each [1, 2, 3, 4, 5] as level}
						<button
							onclick={() => requestStar(level)}
							onmouseenter={() => (hoverStar = level)}
							onmouseleave={() => (hoverStar = 0)}
							disabled={level <= currentRates}
							class="rounded p-1 transition-colors enabled:active:scale-95 enabled:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<svg viewBox="0 0 24 24" class="h-6 w-6 transition-colors {level <= (hoverStar || currentRates) ? 'fill-yellow-400 stroke-yellow-400' : 'fill-none stroke-gray-300 dark:stroke-gray-600'}">
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
							</svg>
						</button>
					{/each}
				</div>

				{#if collectedEmotes.length > 0}
					<div>
						<p class="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Your emotes</p>
						<div class="flex flex-wrap gap-2">
							{#each collectedEmotes as key}
								{@const tier = emoteTiers.find((t) => t.key === key)}
								{#if tier}
									<span class="text-lg" title={tier.label}>{tier.emoji}</span>
								{/if}
							{/each}
						</div>
					</div>
				{/if}

				<div>
					<p class="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Emotes</p>
					<div class="grid grid-cols-3 gap-1.5">
						{#each emoteTiers as tier}
							<button
								onclick={() => requestEmote(tier.key!)}
								disabled={collectedEmotes.includes(tier.key!)}
								class="flex flex-col items-center gap-0.5 rounded-lg border border-gray-200 p-1.5 transition-all enabled:active:scale-95 enabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700 dark:enabled:hover:bg-gray-800"
							>
								<span class="text-lg">{tier.emoji}</span>
								<span class="text-[10px] font-medium text-gray-500 dark:text-gray-400">{tier.cost}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</Popover>
</div>

{#if showPopover}
	<div class="fixed inset-0 z-30 cursor-default" role="button" tabindex="0"
		onclick={() => { showPopover = false; confirming = null; }}
		onkeydown={(e) => e.key === 'Escape' && (showPopover = false, confirming = null)}></div>
{/if}

<script lang="ts">
	import { Comments } from '$lib/scripts/comments';
	import {} from '$lib/scripts/feed';
	import Self from './comment.svelte';
	import CommentCollapsed from '$lib/cmp/comments/comment_collapsed.svelte';
	import CommentHeader from '$lib/cmp/comments/comment_header.svelte';
	import CommentBody from '$lib/cmp/comments/comment_body.svelte';
	import CommentActions from '$lib/cmp/comments/comment_actions.svelte';
	import CommentReplyForm from '$lib/cmp/comments/comment_reply_form.svelte';
	import CommentRepliesToggle from '$lib/cmp/comments/comment_replies_toggle.svelte';

	interface Props {
		comment: TComment;
		index?: number;
	}

	let { comment, index = 0 }: Props = $props();

	let hasPrev = $derived(comment.level > 0 && comment.group?.parent != null);
	let hasNext = $derived(comment.group?.hasNext(comment.index) ?? false);

	function scrollTo(level: number, index: number) {
		const id = 'c-' + level + ':' + index
		const el = document.getElementById(id)
		if (!el) return
		el.scrollIntoView({ behavior: 'smooth', block: 'center' })
		el.classList.add('bg-blue-50', 'dark:bg-blue-900/20')
		el.style.transition = 'background-color 400ms ease'
		setTimeout(() => {
			el.style.transition = 'background-color 600ms ease'
			el.classList.remove('bg-blue-50', 'dark:bg-blue-900/20')
		}, 700)
	}

	function goPrev() {
		if (!hasPrev) return;
		const parent = comment.group!.parent!;
		scrollTo(parent.level, parent.index);
		const el = document.getElementById('c-' + parent.level + ':' + parent.index);
		const btn = el?.querySelector<HTMLButtonElement>('button[data-collapsed-toggler]');
		btn?.click();
	}

	async function goNext() {
		if (!hasNext) return;
		if (comment.group?.parent) {
			const p = comment.group.parent;
			const parentEl = document.getElementById('c-' + p.level + ':' + p.index);
			const btn = parentEl?.querySelector<HTMLButtonElement>('button[data-collapsed-toggler]');
			btn?.click();
		}
		const id = await comment.group!.next(comment.index);
		requestAnimationFrame(() => {
			const el = document.getElementById(id);
			el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		});
	}

	let showingReplies = $state(false);
	let forceFull = $state(false);
	let replying = $state(false);
	let replyText = $state('');
	let currentEmote = $state<string | null>(null);
	let showEmotes = $state(false);

	const threadColors = [
		'border-gray-200 dark:border-gray-700',
		'border-blue-200 dark:border-blue-800'
	];

	let lineColor = $derived(threadColors[comment.level % threadColors.length]);
	let hasReplies = $derived(comment.replies.length > 0);
	let replyCount = $derived(comment.replies.length);
	let collapsed = $derived(showingReplies && hasReplies && !forceFull);

	function totalDescendants(replies: TComment[]): number {
		let n = replies.length;
		for (const r of replies) n += totalDescendants(r.replies);
		return n;
	}

	let totalCount = $derived(totalDescendants(comment.replies));
	let levelDots = $derived(Math.min(comment.level + 1, 5));

	function submitReply() {
		const text = replyText.trim();
		if (!text) return;
		const newReply: TComment = {
			id: Date.now(),
			poster: 'You',
			avatar: 'Y',
			comment: text,
			img: '',
			feed_id: comment.feed_id,
			level: comment.level + 1,
			index: comment.replies.length,
			replies: [],
			engagements: { views: 0, engagements: 0, up: 0, down: 0, pins: 0, star: 0, emote: 0 },
			crt_at: Date.now(),
			up_at: Date.now()
		};
		const child = new Comments();
		child.reply = true;
		child.level = comment.level + 1;
		child.parent = comment;
		child.add([newReply]);
		newReply.group = child;
		comment.replies = [...comment.replies, newReply];
		replyText = '';
		replying = false;
		showingReplies = true;
		forceFull = false;
	}

	function computeAgo(): string {
		const ts = comment.crt_at ?? Date.now()
		const diff = Date.now() - ts
		const s = Math.floor(diff / 1000)
		if (s < 60) return 'just now'
		const m = Math.floor(s / 60)
		if (m < 60) return `${m}m`
		const h = Math.floor(m / 60)
		if (h < 24) return `${h}h`
		return `${Math.floor(h / 24)}d`
	}

	let timeAgo = $state('just now')
	$effect(() => {
		timeAgo = computeAgo()
	})

	function handleExpand() {
		forceFull = true;
	}

	function handleShowReplies() {
		showingReplies = true;
		forceFull = false;
	}

	function handleHideReplies() {
		showingReplies = false;
		forceFull = false;
	}

	function handleToggleEmotes() {
		showEmotes = !showEmotes;
	}

	function handleSelectEmote(em: string) {
		currentEmote = currentEmote === em ? null : em;
		showEmotes = false;
	}

	function handleToggleReply() {
		replying = !replying;
	}

	function handleCancelReply() {
		replying = false;
		replyText = '';
	}
</script>

<div class="relative border-l-[1.5px] {lineColor} animate-[comment-in_200ms_ease-out] {index % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-900/20' : ''}" class:ml-3={comment.level > 0} id="c-{comment.level}:{comment.index}">
		{#if comment.level > 0}
			<span class="absolute -left-[4.5px] top-3.5 h-[7px] w-[7px] rounded-full border-[1.5px] {lineColor} bg-white dark:bg-black"></span>
		{/if}
	<div class="pl-3 py-2.5 pr-2">
		{#if collapsed}
			<CommentCollapsed {comment} {levelDots} onexpand={handleExpand} />
		{:else}
			<CommentHeader {comment} {timeAgo} {levelDots} />
			<CommentBody {comment} />

			<CommentActions
				{comment}
				engagements={comment.engagements}
				{hasPrev}
				{hasNext}
				{replying}
				{currentEmote}
				{showEmotes}
				ontoggle_emotes={handleToggleEmotes}
				onselect_emote={handleSelectEmote}
				ontoggle_reply={handleToggleReply}
				ongoprev={goPrev}
				ongonext={goNext}
			/>

			{#if replying}
				<CommentReplyForm
					bind:replyText={replyText}
					disabled={!replyText.trim()}
					onsubmit={submitReply}
					oncancel={handleCancelReply}
				/>
			{/if}
		{/if}

		{#if hasReplies}
			{#if showingReplies}
				<div class="mt-2">
					{#each comment.replies as reply (reply.id)}
						<Self comment={reply} />
					{/each}
				</div>
				<CommentRepliesToggle {totalCount} expanded={showingReplies} onshow={handleShowReplies} onhide={handleHideReplies} />
			{:else}
				<CommentRepliesToggle {totalCount} expanded={showingReplies} onshow={handleShowReplies} onhide={handleHideReplies} />
			{/if}
		{/if}
	</div>
</div>

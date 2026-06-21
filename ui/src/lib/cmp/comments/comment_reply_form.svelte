<script lang="ts">
	interface Props {
		replyText?: string;
		disabled: boolean;
		onsubmit: () => void;
		oncancel: () => void;
	}

	let { replyText = $bindable(''), disabled, onsubmit, oncancel }: Props = $props();
</script>

<div class="mt-2.5">
	<textarea
		bind:value={replyText}
		rows={2}
		placeholder="Write a reply..."
		class="w-full resize-none rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-300 dark:focus:border-blue-700 transition"
	></textarea>
	<div class="mt-1.5 flex items-center gap-2">
		<button
			onclick={onsubmit}
			disabled={disabled}
			class="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-medium text-white hover:bg-blue-700 disabled:opacity-40 transition"
		>
			Reply
		</button>
		<button
			onclick={oncancel}
			class="rounded-full px-2.5 py-1 text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
		>
			Cancel
		</button>
	</div>
</div>

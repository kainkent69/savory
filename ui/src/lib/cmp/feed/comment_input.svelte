<script lang="ts">
	interface Props {
		placeholder?: string;
	}

	let { placeholder = 'Write a comment...' }: Props = $props();

	let value = $state('');
	let el = $state<HTMLTextAreaElement>();

	$effect(() => {
		void value; // reactive to content changes
		const ta = el;
		if (!ta) return;
		ta.style.height = 'auto';
		// max 5 lines
		ta.style.height = Math.min(ta.scrollHeight, 96) + 'px';
	});
</script>

<textarea
	bind:this={el}
	bind:value
	rows={2}
	{placeholder}
	class="w-full resize-none overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 min-h-[40px] text-[13px] text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-300 dark:focus:border-blue-700 transition"
></textarea>

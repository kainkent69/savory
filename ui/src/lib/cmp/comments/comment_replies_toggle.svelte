<script lang="ts">
    interface Props {
        totalCount: number
        expanded: boolean
        onshow: () => void
        onhide: () => void
    }
    let { totalCount, expanded, onshow, onhide }: Props = $props()
</script>
{#if expanded}
    <button onclick={onhide} class="mt-2 text-[10px] text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline transition">
        Hide replies
    </button>
{:else}
    <button onclick={onshow} class="mt-2 text-[10px] text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline transition">
        Show {totalCount} {totalCount === 1 ? 'reply' : 'replies'}
    </button>
{/if}

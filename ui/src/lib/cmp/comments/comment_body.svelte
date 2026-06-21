<script lang="ts">
    interface Props { comment: TComment }
    let { comment }: Props = $props()
</script>
<p class="mt-1.5 text-xs leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
    {comment.comment}
</p>

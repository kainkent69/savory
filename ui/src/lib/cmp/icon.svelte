<script lang="ts">
	interface Props {
		src: string;
		class?: string;
	}

	let { src, class: cls = '' }: Props = $props();
</script>

<span class="contents {cls}">{@html src}</span>

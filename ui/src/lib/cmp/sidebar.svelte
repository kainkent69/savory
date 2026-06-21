<script lang="ts">
	import { home, search, bell, message, user, plus, chevron_left } from '$lib/assets/icons/index';

	interface Props {
		collapsed: boolean;
		ontoggle?: () => void;
	}

	let { collapsed, ontoggle }: Props = $props();

	const navItems = [
		{ label: 'Home', icon: home, count: 0 },
		{ label: 'Explore', icon: search, count: 0 },
		{ label: 'Notifications', icon: bell, count: 3 },
		{ label: 'Messages', icon: message, count: 7 },
		{ label: 'Profile', icon: user, count: 0 },
	];

	let activeIdx = $state(0); // fake state — later replaced by route
</script>

<aside class="flex h-full flex-col justify-between overflow-hidden transition-all duration-200 {collapsed ? 'w-[72px] items-center px-2 py-4' : 'w-[275px] p-4'}">
	<!-- ── TOP: menu ── -->
	<div class="flex flex-col {collapsed ? 'items-center' : ''}">
		<!-- Logo -->
		<a href="/" class="flex items-center gap-2 {collapsed ? 'justify-center' : 'px-3'} py-2">
			<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">S</div>
			{#if !collapsed}
				<span class="text-lg font-bold text-gray-900 dark:text-gray-100">Savory</span>
			{/if}
		</a>

		<!-- Nav -->
		<nav class="mt-4 flex flex-col {collapsed ? 'items-center gap-1' : 'gap-0'}">
			{#each navItems as item, i}
				{@const active = activeIdx === i}
				<button
					onclick={() => activeIdx = i}
					title={collapsed ? item.label : undefined}
					class="relative flex items-center gap-3 rounded-full cursor-pointer transition-all duration-200 ease-out hover:bg-gray-100 dark:hover:bg-gray-800 {collapsed ? 'h-12 w-12 justify-center p-0' : 'px-3 py-3 text-base font-medium'} {active ? 'text-gray-900 dark:text-gray-100 font-bold bg-gray-100 dark:bg-gray-800 shadow-sm -translate-y-0.5' : 'text-gray-600 dark:text-gray-400 translate-y-0'}"
				>
					<span class="relative icon h-6 w-6 shrink-0">
						{@html item.icon}
						<!-- compact badge dot -->
						{#if collapsed && item.count > 0}
							<span class="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white ring-2 ring-white dark:ring-black">{item.count}</span>
						{/if}
					</span>
					{#if !collapsed}
						<span class="flex-1 text-left">{item.label}</span>
						<!-- full badge -->
						{#if item.count > 0}
							<span class="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-bold text-white">{item.count}</span>
						{/if}
					{/if}
				</button>
			{/each}
		</nav>

		<!-- Post button -->
		{#if collapsed}
			<button class="mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition" title="Post">
				<span class="icon h-6 w-6">{@html plus}</span>
			</button>
		{:else}
			<button class="mt-4 w-full rounded-full bg-blue-600 py-3 text-base font-bold text-white hover:bg-blue-700 transition">
				Post
			</button>
		{/if}
	</div>

	<!-- ── BOTTOM: others ── -->
	<div class="flex flex-col {collapsed ? 'items-center gap-2' : ''}">
		<!-- User pill -->
		<div class="flex items-center gap-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer {collapsed ? 'h-10 w-10 justify-center' : 'p-3'}">
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-sm font-bold text-white">U</div>
			{#if !collapsed}
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">User</p>
					<p class="text-xs text-gray-500 dark:text-gray-400 truncate">@username</p>
				</div>
			{/if}
		</div>

		<!-- Collapse toggle -->
		<button
			onclick={ontoggle}
			class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition {collapsed ? '' : 'self-end'}"
			title={collapsed ? 'Expand' : 'Collapse'}
		>
			<span class="icon h-4 w-4 transition-transform {collapsed ? 'rotate-180' : ''}">{@html chevron_left}</span>
		</button>
	</div>
</aside>

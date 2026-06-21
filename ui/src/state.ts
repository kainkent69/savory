import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { derived, get } from 'svelte/store';

function queryParam(key: string) {
	const { subscribe } = derived(page, $page => $page.url.searchParams.get(key) ?? null);

	return {
		subscribe,
		set(value: string | null) {
			const url = new URL(get(page).url);
			if (value === null) url.searchParams.delete(key);
			else url.searchParams.set(key, value);
			goto(url.search ? `?${url.search}` : url.pathname, {
				replaceState: false,
				keepFocus: true,
				noScroll: true,
			});
		},
	};
}

export const post = queryParam('post');

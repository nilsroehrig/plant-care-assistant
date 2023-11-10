import { redirect, type ServerLoadEvent } from '@sveltejs/kit';

export function load({ url }: ServerLoadEvent) {
	if (url.pathname === '/') {
		throw redirect(302, '/app');
	}
}

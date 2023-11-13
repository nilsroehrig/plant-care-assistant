import { type Actions, redirect } from '@sveltejs/kit';
import { adminApp } from "$lib/server/firebase";

export const actions = {
	async login({request, cookies}) {
		const formData = await request.formData();
		const idToken = formData.get('idToken');
		if (!idToken) {
			throw redirect(302, '/login');
		}

		const sessionCookie = await adminApp().auth().createSessionCookie(idToken as string, {expiresIn: 60 * 1000 * 60 * 24 * 5});
		cookies.set('__session', sessionCookie, {
			maxAge: 60 * 60 * 24 * 5,
			sameSite: 'lax',
			path: '/',
			secure: true,
			httpOnly: true,
		});

		throw redirect(302, '/app');
	},
	logout({cookies}) {
		cookies.delete('__session');
		throw redirect(302, '/login');
	}
} satisfies Actions;

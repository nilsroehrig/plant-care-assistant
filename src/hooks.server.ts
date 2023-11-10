import { redirect } from '@sveltejs/kit';
import { getAuth } from 'firebase-admin/auth';
import functions from 'firebase-functions';
import { adminApp } from '$lib/server/firebase';

export async function handle({ resolve, event }) {
	event.locals.app = adminApp();

	if (event.url.pathname.startsWith('/app')) {
		const idToken = event.cookies.get('__session');
		if (!idToken) {
			throw redirect(302, '/login');
		}

		try {
			const decodedIdToken = await getAuth(event.locals.app).verifySessionCookie(idToken, true);
			event.locals.uid = decodedIdToken.uid;
		} catch (e) {
			functions.logger.error(e);
			throw redirect(302, '/login');
		}
	}

	return resolve(event);
}

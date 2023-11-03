import { redirect } from '@sveltejs/kit';
import { getAuth } from 'firebase-admin/auth';
import functions from 'firebase-functions';
import { adminApp } from './lib/server/firebase';

export async function handle({ resolve, event }) {
	event.locals.app = adminApp();

	if (event.url.pathname.startsWith('/app')) {
		const idToken = event.cookies.get('idToken');

		if (!idToken) {
			throw redirect(302, '/login');
		}

		try {
			await getAuth(event.locals.app).verifyIdToken(idToken);
		} catch (e) {
			functions.logger.error(e);
			throw redirect(302, '/login');
		}
	}

	return resolve(event);
}

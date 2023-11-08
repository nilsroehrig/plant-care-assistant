import { redirect } from '@sveltejs/kit';
import { getAuth } from 'firebase-admin/auth';
import functions from 'firebase-functions';
import { adminApp } from './lib/server/firebase';

export async function handle({ resolve, event }) {
	event.locals.app = adminApp();

	if (event.url.pathname.startsWith('/app')) {
		// TODO: the client side cookie is seemingly stripped by firebase, so the idToken must be transferred another way (see login/+page.svelte).
		// Using a session cookie is recommended by the docs: https://firebase.google.com/docs/auth/admin/manage-cookies?hl=en
		const idToken = event.cookies.get('idToken');

		functions.logger.info(`ID TOKEN: ${idToken}`);

		if (!idToken) {
			throw redirect(302, '/login');
		}

		try {
			const decodedIdToken = await getAuth(event.locals.app).verifyIdToken(idToken);
			event.locals.uid = decodedIdToken.uid;
		} catch (e) {
			functions.logger.error(e);
			throw redirect(302, '/login');
		}
	}

	return resolve(event);
}

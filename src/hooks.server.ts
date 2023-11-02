import { apps, initializeApp } from 'firebase-admin';

export function handle({ resolve, event }) {
	if (apps.length === 0) {
		initializeApp();
	}

	return resolve(event);
}

import admin from 'firebase-admin';

export function adminApp(): admin.app.App {
	if (admin.apps.length === 0 || admin.apps[0] === null) {
		return admin.initializeApp();
	}
	return admin.apps[0];
}

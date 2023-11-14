import { browser } from '$app/environment';
import { config } from '$lib/config/firebaseConfig';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
	browserSessionPersistence,
	getAuth,
	onAuthStateChanged,
	type Auth,
	type Unsubscribe,
	type User
} from 'firebase/auth';
import {
	writable,
	type Invalidator,
	type Readable,
	type Subscriber,
	type Writable
} from 'svelte/store';

export type FirebaseStoreData = {
	app: FirebaseApp;
	user: User | null;
};

export type FirebaseStore = Readable<FirebaseStoreData>;

export function createFirebaseStore(): FirebaseStore {
	const app = initializeApp(config);
	const firebaseStore: Writable<FirebaseStoreData> = writable({
		app,
		user: null
	});

	let auth: Auth;
	let unsubscibeAuthStateChanged: Unsubscribe;
	if (browser) {
		auth = getAuth(app);
		auth.setPersistence(browserSessionPersistence).catch(console.error);
		unsubscibeAuthStateChanged = onAuthStateChanged(auth, (user: any) => {
			firebaseStore.update((store) => ({ ...store, user }));
		});
	}

	return {
		subscribe(
			this: void,
			run: Subscriber<FirebaseStoreData>,
			invalidate?: Invalidator<FirebaseStoreData>
		) {
			const unsubscribeFirebaseStore = firebaseStore.subscribe(run, invalidate);
			return () => {
				unsubscribeFirebaseStore();
				unsubscibeAuthStateChanged();
			};
		}
	};
}

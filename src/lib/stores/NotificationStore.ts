import { browser } from '$app/environment';
import type { Unsubscribe } from 'firebase/auth';
import { Timestamp, collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import {
	writable,
	type Invalidator,
	type Readable,
	type Subscriber,
	type Writable
} from 'svelte/store';
import type { FirebaseStore } from './FirebaseStore';

type NotificationStore = Readable<string> & { dismiss: (this: void) => void };

export function createNotificationStore(firebaseStore: FirebaseStore): NotificationStore {
	let notificationStore: Writable<string> = writable('');
	let listenerRegistered = false;
	let unsubscribeSnapshot: Unsubscribe;
	const dismiss = () => notificationStore.set('');

	if (!browser) {
		return {
			subscribe: notificationStore.subscribe,
			dismiss
		};
	}

	let unsubscribeFirebaseStore = firebaseStore.subscribe(({ app, user }) => {
		if (!app || !user) {
			return;
		}

		if (listenerRegistered) {
			unsubscribeFirebaseStore();
		}

		const firestore = getFirestore(app);
		const q = query(
			collection(firestore, 'notifications'),
			where('owner', '==', user.uid),
			where('createdAt', '>=', Timestamp.fromDate(new Date()))
		);

		unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
			querySnapshot.forEach((doc) => {
				notificationStore.set(doc.data().message);
			});
		});

		listenerRegistered = true;
	});

	return {
		subscribe(this: void, run: Subscriber<string>, invalidate?: Invalidator<string>) {
			const unsubscribeNotificationStore = notificationStore.subscribe(run, invalidate);
			return () => {
				unsubscribeNotificationStore();
				unsubscribeSnapshot();
				unsubscribeFirebaseStore();
			};
		},
		dismiss
	};
}

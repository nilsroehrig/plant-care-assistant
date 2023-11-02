<script lang="ts" context="module">
	type FirebaseStoreData = {
		app: FirebaseApp | null;
		auth: Auth | null;
	};

	export type FirebaseStore = Readable<FirebaseStoreData>;
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import '@picocss/pico';
	import { initializeApp, type FirebaseApp } from 'firebase/app';
	import {
		browserSessionPersistence,
		connectAuthEmulator,
		getAuth,
		onAuthStateChanged,
		signOut,
		type Auth
	} from 'firebase/auth';
	import { setContext } from 'svelte';
	import { readonly, writable, type Readable, type Writable } from 'svelte/store';

	const firebaseStore: Writable<FirebaseStoreData> = writable({
		app: null,
		auth: null
	});

	if (browser) {
		// Your web app's Firebase configuration
		const firebaseConfig = {
			apiKey: 'AIzaSyCXM-aOfj75tbwTYU9IC4SLlVnLsjzo4T0',
			authDomain: 'fir-playground-22c29.firebaseapp.com',
			projectId: 'fir-playground-22c29',
			storageBucket: 'fir-playground-22c29.appspot.com',
			messagingSenderId: '749449297551',
			appId: '1:749449297551:web:cb398016eb7c9f57a2bafa'
		};

		// Initialize Firebase
		const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);

		auth.setPersistence(browserSessionPersistence).catch(console.error);

		connectAuthEmulator(auth, 'http://localhost:9099');

		onAuthStateChanged(auth, () => {
			firebaseStore.set({
				app,
				auth
			});
		});
	}

	setContext('firebase', readonly(firebaseStore));

	let isLoggingOut = false;

	function logout() {
		isLoggingOut = true;
		if ($firebaseStore.auth == null) {
			return;
		}

		return signOut($firebaseStore.auth)
			.catch(console.error)
			.finally(() => (isLoggingOut = false));
	}
</script>

<div class="wrapper">
	<header class="container">
		<nav>
			<ul>
				<li><strong>Plant Care Assistant</strong></li>
			</ul>
			<ul>
				<li>
					{#if $firebaseStore.auth?.currentUser}
						<a
							href="/logout"
							role="button"
							aria-busy={isLoggingOut}
							on:click|preventDefault={logout}>Logout</a
						>
					{:else}
						<a href="/login" role="button">Login</a>
					{/if}
				</li>
			</ul>
		</nav>
	</header>

	<slot />

	<footer class="container">SvelteKit &hearts; Firebase</footer>
</div>

<style>
	.wrapper {
		display: grid;
		min-height: 100vh;
		grid-template-rows: min-content 1fr min-content;
	}

	footer {
		padding: 1rem 0;
		font-size: smaller;
		text-align: center;
	}
</style>

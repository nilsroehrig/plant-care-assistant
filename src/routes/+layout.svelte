<script lang="ts">
	import '$lib/styles/global.css';
	import '@picocss/pico';

	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { config } from '$lib/config/firebaseConfig';
	import type { FirebaseStoreData } from '$lib/stores/FirebaseStore';
	import { initializeApp } from 'firebase/app';
	import type { Auth } from 'firebase/auth';
	import {
		browserSessionPersistence,
		getAuth,
		onAuthStateChanged,
		signOut,
		type Unsubscribe
	} from 'firebase/auth';
	import { setContext } from 'svelte';
	import { Icon, Plus } from 'svelte-hero-icons';
	import { readonly, writable, type Writable } from 'svelte/store';

	const app = initializeApp(config);
	const firebaseStore: Writable<FirebaseStoreData> = writable({
		app,
		user: null
	});

	setContext('firebase', readonly(firebaseStore));

	let auth: Auth;
	if (browser) {
		auth = getAuth(app);
		auth.setPersistence(browserSessionPersistence).catch(console.error);
		onAuthStateChanged(auth, (user) => {
			firebaseStore.update((store) => ({ ...store, user }));
		});
	}

	let isLoggingOut = false;
</script>

<div class="wrapper">
	<header class="container">
		<nav>
			<ul>
				<li><strong>Plant Care Assistant</strong></li>
			</ul>
			<ul>
				{#if $firebaseStore.user}
					<li>
						<a href="/app/create-plant" role="button" class="outline">
							<Icon src={Plus} size="20" />
							Create Plant</a
						>
					</li>
					<li>
						<form
							method="POST"
							action="/login?/logout"
							use:enhance={async () => {
								isLoggingOut = true;
								try {
									await signOut(auth);
								} catch (e) {
									console.error(e);
								} finally {
									isLoggingOut = false;
								}
							}}
						>
							<button type="submit" class="secondary outline">Logout</button>
						</form>
					</li>
				{:else}
					<li><a href="/login" role="button" class="secondary outline">Login</a></li>
				{/if}
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

	li a {
		display: flex;
		align-items: center;
	}

	li form {
		margin: 0;
	}

	li button {
		--form-element-spacing-vertical: var(--nav-link-spacing-vertical);
		--form-element-spacing-horizontal: var(--nav-link-spacing-horizontal);
	}

	footer {
		padding: 1rem 0;
		font-size: smaller;
		text-align: center;
	}
</style>

<script lang="ts" context="module">
  type FirebaseStoreData = {
    app: FirebaseApp | null;
    auth: Auth | null;
  };

  export type FirebaseStore = Readable<FirebaseStoreData>;
</script>

<script lang="ts">
  import '$lib/styles/global.css';
  import '@picocss/pico';

  import { browser, dev } from '$app/environment';
  import { config } from '$lib/config/firebaseConfig';
  import { initializeApp, type FirebaseApp } from 'firebase/app';
  import {
    browserSessionPersistence,
    getAuth,
    onAuthStateChanged,
    onIdTokenChanged,
    signOut,
    type Auth,
    type Unsubscribe
  } from 'firebase/auth';
  import Cookies from 'js-cookie';
  import { onDestroy, setContext } from 'svelte';
  import { Icon, Plus } from 'svelte-hero-icons';
  import { readonly, writable, type Readable, type Writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';

  const subscriptions: Unsubscribe[] = [];

  const firebaseStore: Writable<FirebaseStoreData> = writable({
    app: null,
    auth: null
  });

  if (browser) {
    // Initialize Firebase
    const app = initializeApp(config);
    const auth = getAuth(app);

    auth.setPersistence(browserSessionPersistence).catch(console.error);

    subscriptions.push(
      onAuthStateChanged(auth, () => {
        firebaseStore.set({
          app,
          auth
        });
      })
    );

    subscriptions.push(
      onIdTokenChanged(auth, (user) => {
        user
          ?.getIdToken()
          .then((token) => Cookies.set('idToken', token, {expires: 1 / 24, sameSite: 'Strict'}))
          .catch(console.error);
      })
    );
  }

  setContext('firebase', readonly(firebaseStore));

  let isLoggingOut = false;

  onDestroy(() => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
    subscriptions.length = 0;
  });
</script>

<div class="wrapper">
  <header class="container">
    <nav>
      <ul>
        <li><strong>Plant Care Assistant</strong></li>
      </ul>
      <ul>
        {#if $firebaseStore.auth?.currentUser}
          <li>
            <a href="/app/create-plant" role="button" class="outline"
            >
              <Icon src={Plus} size="20"/>
              Create Plant</a
            >
          </li>
          <li>
            <form method="POST" action="/login?/logout" use:enhance={async () => {
							isLoggingOut = true;
							try {
								await signOut($firebaseStore.auth)
			        } catch(e) {
				        console.error(e)
			        } finally {
								isLoggingOut = false;
						  }
            }}>
              <button type="submit" class="secondary outline">Logout</button>
            </form>
          </li>
        {:else}
          <li><a href="/login" role="button" class="secondary outline">Login</a></li>
        {/if}
      </ul>
    </nav>
  </header>

  <slot/>

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

    footer {
        padding: 1rem 0;
        font-size: smaller;
        text-align: center;
    }
</style>

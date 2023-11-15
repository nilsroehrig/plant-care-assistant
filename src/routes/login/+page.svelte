<script lang="ts">
  import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  import { enhance } from '$app/forms';
  import { getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { FirebaseStore } from '../+layout.svelte';

  const firebase = getContext<FirebaseStore>('firebase');

  let error = {
    message: null as null | string
  };

  const auth = getAuth($firebase.app);

  let busy = false;

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const signInResult = await signInWithPopup($firebase.auth, provider)
    return signInResult.user.getIdToken();
  }
</script>

<main class="container">
  <article class="grid">
    <div>
      <hgroup>
        <h1>Sign in</h1>
        <h2>Welcome to Plant Care Assistant</h2>
      </hgroup>
      <form action="?/login" use:enhance={async ({formData, cancel}) => {
				busy = true;
				const email = formData.get("email");
				const password = formData.get("password");

				try {
          const userCred = await signInWithEmailAndPassword(auth, email, password)
          const token = await userCred.user.getIdToken();
          formData.set("idToken", token);
				} catch(e) {
					console.error(e);
					error.message = 'Invalid credentials.';
					cancel();
				} finally {
					busy = false;
				}
			}} method="POST">
        <input
            type="text"
            name="email"
            placeholder="E-Mail"
            aria-label="E-Mail"
            autocomplete="email"
            required
        />
        <input
            type="password"
            name="password"
            placeholder="Password"
            aria-label="Password"
            autocomplete="current-password"
            required
        />
        {#if error.message != null}
          <p class="error" transition:fade>{error.message}</p>
        {/if}
        <button type="submit" aria-busy={busy}>Login</button>
      </form>
      <div>
        <form method="post" action="?/login" use:enhance={async ({formData}) => {
            const idToken = await loginWithGoogle();
            formData.set("idToken", idToken);
        }}>
          <button type="submit">Login with Google</button>
        </form>
      </div>
    </div>
    <div class="image"/>
  </article>
  <p class="attribution">
    Photo by <a
      href="https://unsplash.com/de/@feeypflanzen?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
  >feey</a
  >
    on
    <a
        href="https://unsplash.com/de/fotos/grune-pflanze-im-weissen-topf-qoegZJ3ybOY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
    >Unsplash</a
    >
  </p>
</main>

<style>
    main {
        align-self: center;
    }

    article {
        padding: 0;
        overflow: hidden;
    }

    article div {
        padding: 1rem;
    }

    .error {
        color: var(--del-color);
    }

    .attribution {
        text-align: right;
        font-size: smaller;
        padding: 0.5rem;
    }

    @media (min-width: 576px) {
        article div {
            padding: 1.25rem;
        }
    }

    @media (min-width: 768px) {
        article div {
            padding: 1.5rem;
        }
    }

    @media (min-width: 992px) {
        article div {
            padding: 1.75rem;
        }
    }

    @media (min-width: 1200px) {
        article div {
            padding: 2rem;
        }
    }

    /* Hero Image */
    article div:nth-of-type(2) {
        display: none;
        background-color: #374956;
        background-image: url('/feey-qoegZJ3ybOY-unsplash.jpg');
        background-position: center 60%;
        background-size: cover;
    }

    @media (min-width: 992px) {
        .grid > div:nth-of-type(2) {
            display: block;
        }
    }
</style>

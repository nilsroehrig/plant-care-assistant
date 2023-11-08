<script lang="ts">
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import Cookies from 'js-cookie';
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { FirebaseStore } from '../+layout.svelte';

	const firebase = getContext<FirebaseStore>('firebase');

	let error = {
		message: null as null | string
	};

	let busy = false;

	$: disabled = $firebase.auth == null;

	function tryLogin({ target }: SubmitEvent) {
		busy = true;

		if (!(target instanceof HTMLFormElement) || $firebase.auth == null) {
			return;
		}

		const data = new FormData(target);
		const email = data.get('email');
		const password = data.get('password');

		if (typeof email !== 'string' || typeof password !== 'string') {
			return;
		}

		signInWithEmailAndPassword($firebase.auth, email, password)
			.then(async (userCred) => {
				const token = await userCred.user.getIdToken();
				// TODO: using a cookie does not work here. The idToken must be transferred to the server in another fashion
				// (e.g. hidden form field or Authorization header). See hooks.server.ts for further steps after that.
				Cookies.set('idToken', token, { expires: 1 / 24, sameSite: 'Strict' });
				target.submit();
			})
			.catch((e) => {
				console.error(e);
				error.message = 'Invalid credentials.';
			})
			.finally(() => {
				busy = false;
			});
	}
</script>

<main class="container">
	<article class="grid">
		<div>
			<hgroup>
				<h1>Sign in</h1>
				<h2>Welcome to Plant Care Assistant</h2>
			</hgroup>
			<form on:submit|preventDefault={tryLogin} method="post">
				<input
					type="text"
					name="email"
					placeholder="E-Mail"
					aria-label="E-Mail"
					autocomplete="email"
					required
					{disabled}
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					aria-label="Password"
					autocomplete="current-password"
					required
					{disabled}
				/>
				{#if error.message != null}
					<p class="error" transition:fade>{error.message}</p>
				{/if}
				<button type="submit" aria-busy={busy} {disabled}>Login</button>
			</form>
		</div>
		<div class="image" />
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

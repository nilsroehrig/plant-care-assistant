<script lang="ts">
	import { getContext } from 'svelte';
	import type { FirebaseStore } from '../+layout.svelte';

	const firebase = getContext<FirebaseStore>('firebase');
</script>

<article>
	<header>Login Status</header>
	{#if $firebase.auth?.currentUser}
		<p>Hello {$firebase.auth.currentUser.displayName}, you are currently logged in.</p>
	{:else}
		<p class="logged-out">You are currently not logged in.</p>
	{/if}
</article>

<style>
	p {
		color: var(--ins-color);
	}

	.logged-out {
		color: var(--del-color);
	}
</style>
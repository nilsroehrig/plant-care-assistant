<script lang="ts">
	import { getContext } from 'svelte';
	import type { FirebaseStore } from '../+layout.svelte';

	const firebase = getContext<FirebaseStore>('firebase');
</script>

<main class="container">
	{#if $firebase.auth?.currentUser}
		<h1 style:color="green">Logged in on client! Hello {$firebase.auth.currentUser.displayName}.</h1>
	{:else}
		<h1 style:color="red">Not logged in on client!</h1>
	{/if}
</main>

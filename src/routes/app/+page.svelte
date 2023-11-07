<script lang="ts">
	import { getContext } from 'svelte';
	import type { FirebaseStore } from '../+layout.svelte';
	import PlantCard from '$lib/components/PlantCard.svelte';

	const firebase = getContext<FirebaseStore>('firebase');

	export let data;

	$: user = $firebase.auth?.currentUser;
</script>

{#if !user}
	<article aria-busy="true"></article>
{:else}
	<article>
		<hgroup>
			<h1>Hi {user.displayName},</h1>
			<h2>Take a look at your plants here!</h2>
		</hgroup>
	</article>
	<div class="plants">
		{#each data.plants as plant}
			<PlantCard {plant} />
		{/each}
	</div>
{/if}

<style>
	hgroup {
		margin-bottom: 0;
	}

	.plants {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}
</style>

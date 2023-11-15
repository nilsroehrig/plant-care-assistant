<script lang="ts">
	import Notification from '$lib/components/Notification.svelte';
	import PlantCard from '$lib/components/PlantCard.svelte';
	import type { FirebaseStore } from '$lib/stores/FirebaseStore.js';
	import { getContext } from 'svelte';
	import { createNotificationStore } from '../../lib/stores/NotificationStore.js';

	const firebase = getContext<FirebaseStore>('firebase');
	const notification = createNotificationStore(firebase);

	export let data;

	$: hasNotification = $notification !== '';
</script>

{#if !$firebase.user}
	<article aria-busy="true"></article>
{:else}
	<div class="dashboard">
		<article class="header">
			<hgroup>
				<h1>Hi {$firebase.user.displayName ?? $firebase.user.email},</h1>
				<h2>Take a look at your plants here!</h2>
			</hgroup>
		</article>
		{#each data.plants as plant}
			<PlantCard {plant} />
		{/each}
		{#if hasNotification}
			<Notification notification={$notification} on:dismiss={notification.dismiss} />
		{/if}
	</div>
{/if}

<style>
	.dashboard {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-top: 1rem;
	}

	.dashboard > article {
		margin: 0;
	}

	.header {
		grid-column: 1 / -1;
	}

	hgroup {
		margin-bottom: 0;
	}
</style>

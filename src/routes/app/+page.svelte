<script lang="ts">
	import { getContext } from 'svelte';
	import type { FirebaseStore } from '../+layout.svelte';
	import PlantCard from '$lib/components/PlantCard.svelte';
	import { BellAlert, Icon, XMark } from 'svelte-hero-icons';
	import {
		onSnapshot,
		getFirestore,
		query,
		collection,
		where,
		Timestamp
	} from 'firebase/firestore';
	import type { FirebaseApp } from 'firebase/app';
	import { browser } from '$app/environment';

	const firebase = getContext<FirebaseStore>('firebase');

	export let data;

	let notification = '';
	$: hasNotification = notification !== '';

	$: if (browser && $firebase.user) {
		const firebaseApp: FirebaseApp = $firebase.app!;
		const firestore = getFirestore(firebaseApp);
		const q = query(
			collection(firestore, 'notifications'),
			where('owner', '==', $firebase.user.uid),
			where('createdAt', '>=', Timestamp.fromDate(new Date()))
		);
		onSnapshot(q, (querySnapshot) => {
			querySnapshot.forEach((doc) => {
				notification = doc.data().message;
			});
		});
	}

	function resetNotification() {
		notification = '';
	}
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
			<article class="notification container">
				<span class="notification-icon">
					<Icon src={BellAlert} width={32} />
				</span>
				<span class="notification-message">{notification}</span>
				<button on:click={resetNotification} class="outline secondary"
					><Icon src={XMark} width={24} /></button
				>
			</article>
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

	.notification {
		display: flex;
		align-items: center;
		justify-content: center;
		grid-template-columns: min-content auto min-content;
		padding: 1rem;
		position: fixed;
		bottom: 3rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		gap: 1rem;
	}

	.notification-icon {
		flex: 0;
		padding: 0.5rem;
	}

	.notification-message {
		flex: 1;
	}

	.notification > button {
		padding: 0.5rem;
		flex: 0;
		margin: 0;
		background: transparent;
		border: 0;
	}
</style>

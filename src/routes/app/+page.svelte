<script lang="ts">
	import { getContext } from 'svelte';
	import type { FirebaseStore } from '../+layout.svelte';
	import PlantCard from '$lib/components/PlantCard.svelte';
	import { BellAlert, Icon } from "svelte-hero-icons";
	import { onSnapshot, getFirestore, query, collection, where, Timestamp } from "firebase/firestore";
	import type { FirebaseApp } from "firebase/app";
	import { browser } from "$app/environment";
	import { getAuth, onAuthStateChanged } from "firebase/auth";

	const firebase = getContext<FirebaseStore>('firebase');

	export let data;

	const auth = getAuth($firebase.app!);

	$: user = auth.currentUser;
	$: notification = "";
	$: hasNotification = notification !== "";

	if (browser) {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				const firebaseApp: FirebaseApp = $firebase.app!;
				const firestore = getFirestore(firebaseApp);
				const q = query(
						collection(firestore, "notifications"),
						where("owner", "==", user.uid),
						where("createdAt", ">=", Timestamp.fromDate(new Date()))
				);
				onSnapshot(
						q,
						(querySnapshot) => {
							querySnapshot.forEach((doc) => {
								console.log("notification");
								console.log(doc.data());
								notification = doc.data().message;
							});
						});
			}
		});
	}

	function resetNotification() {
		notification = "";
	}
</script>

{#if !user}
	<article aria-busy="true"></article>
{:else}
	<div class="dashboard">
		<article class="header">
			<hgroup>
				<h1>Hi {user.displayName ?? user.email},</h1>
				<h2>Take a look at your plants here!</h2>
			</hgroup>
		</article>
		{#each data.plants as plant}
			<PlantCard {plant} />
		{/each}
		{#if hasNotification}
			<div class="notification">
				<Icon src={BellAlert} width={20} />
				<span>{notification}</span>
				<button on:click={resetNotification}>X</button>
			</div>
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
		background-color: var(--color-primary);
		color: var(--color-primary-contrast);
		padding: 1rem;
		border-radius: 0.5rem;
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 100;
	}
</style>

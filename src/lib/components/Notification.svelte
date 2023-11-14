<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { BellAlert, Icon, XMark } from 'svelte-hero-icons';

	const dispatch = createEventDispatcher();
	export let notification = '';
</script>

<article class="notification container">
	<span class="notification-icon">
		<Icon src={BellAlert} width={32} />
	</span>
	<span class="notification-message">{notification}</span>
	<button on:click={() => dispatch('dismiss')} class="outline secondary"
		><Icon src={XMark} width={24} /></button
	>
</article>

<style>
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

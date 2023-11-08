<script lang="ts">
	import type { PlantDto } from '$lib/domain/Plant';
	import { DateTime } from 'luxon';
	import { Icon, Clipboard, Pencil } from 'svelte-hero-icons';

	export let plant: PlantDto;

	$: lastWatered = DateTime.fromISO(plant.lastWatered);
	$: isOverdue = lastWatered.plus({ hours: plant.wateringIntervalInHours }) < DateTime.now();
	$: isFine =
		lastWatered.plus({ hours: plant.wateringIntervalInHours }) > DateTime.now().plus({ days: 1 });
	const formatter = Intl.DateTimeFormat('en-UK', {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	});
</script>

<article>
	<img src={plant.imageUrl} alt="" />

	<h4>{plant.name}</h4>
	<div class="stats">
		<small>Watering Schedule:</small>
		<strong>
			{plant.amountPerWateringInMilliliters}<abbr title="Milliliters">ml</abbr> every {plant.wateringIntervalInHours}
			hours.
		</strong>

		<small>Last Watering:</small>
		<strong class:is-overdue={isOverdue} class:is-fine={isFine}>
			{formatter.format(lastWatered.toJSDate())}
		</strong>
	</div>
	<div class="actions">
		{#if plant.furtherInstructions}
			<button class="contrast small" data-tooltip="Instructions" data-placement="top">
				<Icon src={Clipboard} width={20} />
			</button>
		{/if}
		<a
			href="/app/edit-plant/{plant.id}"
			role="button"
			class="contrast small"
			data-tooltip="Edit"
			data-placement="top"
		>
			<Icon src={Pencil} width={20} />
		</a>
	</div>
</article>

<style>
	article {
		text-align: center;
		margin: 0;
	}
	img {
		width: 12rem;
		height: 12rem;
		border-radius: 50%;
	}

	h4 {
		margin-top: 2rem;
		margin-bottom: 0;
	}

	.stats small {
		display: block;
		margin-top: 1rem;
	}

	.is-overdue {
		color: var(--del-color);
	}

	.is-fine {
		color: var(--ins-color);
	}

	.actions {
		display: flex;
		margin-top: 2rem;
		gap: 1rem;
		justify-content: center;
	}

	.actions button,
	.actions a {
		margin-bottom: 0;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
	}

	button.small,
	a[role='button'].small {
		--form-element-spacing-vertical: 0.375rem;
		--form-element-spacing-horizontal: 0.5rem;
		font-size: smaller;
	}
</style>

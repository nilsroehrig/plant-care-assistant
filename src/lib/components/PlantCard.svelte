<script lang="ts">
	import type { PlantDto } from '$lib/domain/Plant';
	import { DateTime } from 'luxon';
	import { Clipboard, Icon, Pencil } from 'svelte-hero-icons';

	export let plant: PlantDto;

	let open = false;

	$: lastWatered = DateTime.fromISO(plant.lastWatered);
	$: lastFertilized = DateTime.fromISO(plant.lastFertilized);
	$: wateringOverdue = lastWatered.plus({ hours: plant.wateringIntervalInHours }) < DateTime.now();
	$: fertilizingOverdue =
		lastWatered.plus({ weeks: plant.fertilizingIntervalInWeeks }) < DateTime.now();

	$: console.dir({
		lastWatered: lastWatered.toJSDate(),
		lastWateredPlusInterval: lastWatered.plus({ hours: plant.wateringIntervalInHours }).toJSDate()
	});

	const formatter = Intl.DateTimeFormat('en-UK', {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	});

	function toggle() {
		open = !open;
	}
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
		<strong class:is-overdue={wateringOverdue} class:is-fine={!wateringOverdue}>
			{formatter.format(lastWatered.toJSDate())}
		</strong>
	</div>
	<div class="actions">
		<button
			class="contrast small"
			data-tooltip="Details"
			data-placement="top"
			on:click={() => (open = true)}
		>
			<Icon src={Clipboard} width={20} />
		</button>

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

	<dialog {open}>
		<article>
			<header>
				{plant.name}
				<a href="#close" aria-label="Close" class="close" on:click={toggle}></a>
			</header>
			<div class="grid">
				<div class="stats">
					<small>Watering Schedule:</small>
					<strong>
						{plant.amountPerWateringInMilliliters}<abbr title="Milliliters">ml</abbr> every {plant.wateringIntervalInHours}
						hours.
					</strong>

					<small>Last Watering:</small>
					<strong class:is-overdue={wateringOverdue} class:is-fine={!wateringOverdue}>
						{formatter.format(lastWatered.toJSDate())}
					</strong>
				</div>
				<div class="stats">
					<small>Fertilizing Schedule:</small>
					<strong>
						{plant.amountPerFertilizingInGrams}<abbr title="Grams">g</abbr> every {plant.fertilizingIntervalInWeeks}
						weeks.
					</strong>

					<small>Last Fertilizing:</small>
					<strong class:is-overdue={fertilizingOverdue} class:is-fine={!fertilizingOverdue}>
						{formatter.format(lastFertilized.toJSDate())}
					</strong>
				</div>
			</div>
			{#if plant.furtherInstructions}
				<h3>Further Instructions</h3>
				<pre>{plant.furtherInstructions}</pre>
			{/if}
		</article>
	</dialog>
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

	dialog > article {
		width: 80%;
	}

	h3 {
		margin: 2rem 0 1rem;
	}

	pre {
		padding: 1rem;
		white-space: pre-wrap;
		text-align: left;
		margin-bottom: 0;
	}
</style>

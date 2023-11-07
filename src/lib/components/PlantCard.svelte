<script lang="ts">
	import type { PlantDto } from '$lib/domain/Plant';

	export let plant: PlantDto;

	const formatter = Intl.DateTimeFormat('de-DE', {
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
		<small>Watering:</small>
		<strong>
			{plant.amountPerWateringInMilliliters}<abbr title="Milliliters">ml</abbr> every {plant.wateringIntervalInHours}
			hours.
		</strong>

		<small>Last Watering:</small>
		<strong>
			{formatter.format(new Date(plant.lastWatered))} Uhr
		</strong>
	</div>
</article>

<style>
	img {
		max-width: 100%;
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
</style>

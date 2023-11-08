<script lang="ts">
	type PlantFormEntryKey =
		| 'name'
		| 'watering_interval'
		| 'watering_amount'
		| 'last_watering'
		| 'instructions'
		| 'plant_image_url'
		| 'fertilizing_interval'
		| 'fertilizing_amount'
		| 'last_fertilizing';

	export let formData: Partial<Record<PlantFormEntryKey, FormDataEntryValue | null>> = {};
	export let errors: Partial<Record<PlantFormEntryKey, string[]>> = {};

	$: console.log({ formData });

	function isInvalid(field: PlantFormEntryKey) {
		if (formData[field] == undefined) {
			return null;
		}

		if (errors[field]) {
			return true;
		} else {
			return false;
		}
	}

	function getErrors(field: PlantFormEntryKey) {
		return errors[field] ?? [];
	}

	function getFieldValue(field: PlantFormEntryKey) {
		const fieldValue = formData[field];
		if (typeof fieldValue !== 'string') {
			return '';
		}
		return fieldValue;
	}
</script>

<form method="post" novalidate>
	<article>
		<header>Create a new plant</header>
		<div class="body">
			<p style:order={6} style:text-align="right">
				<small>Fields marked with <span class="required">*</span> are required.</small>
			</p>
			<label class="row" style:order={1}>
				<span class="required">*</span> Plant name
				<input
					type="text"
					name="name"
					placeholder="Cactus"
					aria-required="true"
					required
					aria-invalid={isInvalid('name')}
					value={getFieldValue('name')}
				/>
				{#each getErrors('name') as error}
					<p>{error}</p>
				{/each}
			</label>
			<div class="grid row" style:order={2}>
				<label>
					<span class="required">*</span> Watering interval in <abbr title="hours">h</abbr>
					<input
						type="number"
						name="watering_interval"
						placeholder="72"
						aria-required="true"
						required
						aria-invalid={isInvalid('watering_interval')}
						value={getFieldValue('watering_interval')}
					/>
					{#each getErrors('watering_interval') as error}
						<p>{error}</p>
					{/each}
				</label>
				<label>
					<span class="required">*</span> Amount per watering in <abbr title="milliliters">ml</abbr>
					<input
						type="number"
						name="watering_amount"
						placeholder="50"
						aria-required="true"
						required
						aria-invalid={isInvalid('watering_amount')}
						value={getFieldValue('watering_amount')}
					/>
					{#each getErrors('watering_amount') as error}
						<p>{error}</p>
					{/each}
				</label>
				<label>
					Last watering
					<input
						type="datetime-local"
						name="last_watering"
						aria-invalid={isInvalid('last_watering')}
						value={getFieldValue('last_watering')}
					/>
					{#each getErrors('last_watering') as error}
						<p>{error}</p>
					{/each}
				</label>
			</div>
			<div class="grid row" style:order={3}>
				<label>
					<span class="required">*</span> Fertilizing interval in weeks
					<input
						type="number"
						name="fertilizing_interval"
						placeholder="5"
						aria-required="true"
						required
						aria-invalid={isInvalid('fertilizing_interval')}
						value={getFieldValue('fertilizing_interval')}
					/>
					{#each getErrors('fertilizing_interval') as error}
						<p>{error}</p>
					{/each}
				</label>
				<label>
					<span class="required">*</span> Amount per Fertilizing in <abbr title="grams">g</abbr>
					<input
						type="number"
						name="fertilizing_amount"
						placeholder="12"
						aria-required="true"
						required
						aria-invalid={isInvalid('fertilizing_amount')}
						value={getFieldValue('fertilizing_amount')}
					/>
					{#each getErrors('fertilizing_amount') as error}
						<p>{error}</p>
					{/each}
				</label>
				<label>
					Last fertilizing
					<input
						type="datetime-local"
						name="last_fertilizing"
						aria-invalid={isInvalid('last_fertilizing')}
						value={getFieldValue('last_fertilizing')}
					/>
					{#each getErrors('last_fertilizing') as error}
						<p>{error}</p>
					{/each}
				</label>
			</div>
			<div class="grid row" style:order={4}>
				<label>
					<span>Plant Image URL</span>
					<input
						type="url"
						name="plant_image_url"
						placeholder="https://path.to/plant/image"
						aria-invalid={isInvalid('plant_image_url')}
						value={getFieldValue('plant_image_url')}
					/>
				</label>
			</div>
			<label style:order={5} class="row">
				Further instructions
				<textarea
					name="instructions"
					rows="10"
					placeholder="Special care instructions for this plant..."
					aria-invalid={isInvalid('instructions')}
					value={getFieldValue('instructions')}
				></textarea>
				{#each getErrors('instructions') as error}
					<p>{error}</p>
				{/each}
			</label>
		</div>
		<div class="grid row">
			<button type="submit" style:order={2} style:margin-bottom={0}>Create plant</button>
			<a role="button" href="/app" type="button" class="secondary" style:order={1}>Cancel</a>
		</div>
	</article>
</form>

<style>
	.body {
		display: grid;
		grid-template-columns: 1fr;
	}

	.required {
		color: var(--del-color);
	}

	.row + .row {
		margin-top: var(--spacing);
	}

	input {
		margin-bottom: 0;
	}

	input + p,
	textarea + p {
		margin: 0.5rem 0 0;
		font-size: small;
		color: var(--del-color);
	}
</style>

<script lang="ts">
	export let form;

	function isInvalid(field: string) {
		if (!form) {
			return null;
		}

		if (form.errors?.[field]) {
			return true;
		} else {
			return false;
		}
	}

	function getErrors(field: string) {
		return form?.errors?.[field] ?? [];
	}

	function getFieldValue(field: keyof NonNullable<NonNullable<typeof form>['plantFormData']>) {
		const fieldValue = form?.plantFormData?.[field];
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
			<p style:order={5} style:text-align="right">
				<small>Fields marked with <span class="required">*</span> are required.</small>
			</p>
			<div class="grid row" style:order={1}>
				<label>
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
				<label>
					<span class="required">*</span> Watering interval in hours
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
			</div>
			<div class="grid row" style:order={2}>
				<label>
					<span class="required">*</span> Amount per watering in ml
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
			<label style:order={3} class="row">
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
			<label style:order={4} class="row">
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
		<button type="submit">Create plant</button>
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

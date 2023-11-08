<script lang="ts">
	import PlantForm from '$lib/components/PlantForm.svelte';

	export let form;
</script>

<PlantForm formData={form?.plantFormData} errors={form?.errors} />

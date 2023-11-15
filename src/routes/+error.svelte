<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="container">
	<article>
		<hgroup>
			<h1>{$page.status}</h1>
			<h2>{$page.error?.message}</h2>
		</hgroup>
		<a href="/app" role="button" class="outline secondary">Back to Dashboard</a>
	</article>
</main>

<script>
	import '@picocss/pico';
	// Import the functions you need from the SDKs you need
	import { initializeApp } from 'firebase/app';
	import { setContext } from 'svelte';
	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	// Your web app's Firebase configuration
	const firebaseConfig = {
		apiKey: 'AIzaSyCXM-aOfj75tbwTYU9IC4SLlVnLsjzo4T0',
		authDomain: 'fir-playground-22c29.firebaseapp.com',
		projectId: 'fir-playground-22c29',
		storageBucket: 'fir-playground-22c29.appspot.com',
		messagingSenderId: '749449297551',
		appId: '1:749449297551:web:cb398016eb7c9f57a2bafa'
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
    setContext("app", app);
</script>

<div class="wrapper">
	<header class="container">
		<nav>
			<ul>
				<li><strong>Plant Care Assistant</strong></li>
			</ul>
		</nav>
	</header>

	<main class="container">
		<slot />
	</main>

	<footer class="container">SvelteKit &hearts; Firebase</footer>
</div>

<style>
	.wrapper {
		display: grid;
		min-height: 100vh;
		grid-template-rows: min-content 1fr min-content;
	}

	main {
		align-self: center;
	}

	footer {
		padding: 1rem 0;
		font-size: smaller;
		text-align: center;
	}
</style>

<article class="grid">
	<div>
		<hgroup>
			<h1>Sign in</h1>
			<h2>Welcome to Plant Care Assistant</h2>
		</hgroup>
		<form>
			<input
				type="text"
				name="login"
				placeholder="Login"
				aria-label="Login"
				autocomplete="nickname"
				required
			/>
			<input
				type="password"
				name="password"
				placeholder="Password"
				aria-label="Password"
				autocomplete="current-password"
				required
			/>
			<fieldset>
				<label for="remember">
					<input type="checkbox" role="switch" id="remember" name="remember" />
					Remember me
				</label>
			</fieldset>
			<button type="submit" onclick="event.preventDefault()">Login</button>
		</form>
	</div>
	<div class="image" />
</article>
<p>
	Photo by <a
		href="https://unsplash.com/de/@feeypflanzen?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
		>feey</a
	>
	on
	<a
		href="https://unsplash.com/de/fotos/grune-pflanze-im-weissen-topf-qoegZJ3ybOY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
		>Unsplash</a
	>
</p>

<style>
	article {
		padding: 0;
		overflow: hidden;
	}

	article div {
		padding: 1rem;
	}

	p {
		text-align: right;
		font-size: smaller;
		padding: 0.5rem;
	}

	@media (min-width: 576px) {
		article div {
			padding: 1.25rem;
		}
	}

	@media (min-width: 768px) {
		article div {
			padding: 1.5rem;
		}
	}

	@media (min-width: 992px) {
		article div {
			padding: 1.75rem;
		}
	}

	@media (min-width: 1200px) {
		article div {
			padding: 2rem;
		}
	}

	/* Hero Image */
	article div:nth-of-type(2) {
		display: none;
		background-color: #374956;
		background-image: url('/feey-qoegZJ3ybOY-unsplash.jpg');
		background-position: center 60%;
		background-size: cover;
	}

	@media (min-width: 992px) {
		.grid > div:nth-of-type(2) {
			display: block;
		}
	}
</style>

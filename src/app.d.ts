import { app } from 'firebase-admin';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			app: app.App;
			uid?: string;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

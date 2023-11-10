import { PlantDto } from '$lib/domain/Plant';
import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ locals }: ServerLoadEvent) {
	const db = locals.app.firestore();

	const plantDocs = await db.collection('plants').where('owner', '==', locals.uid).get();
	const plants = plantDocs.docs.map((doc) => PlantDto.parse({...doc.data(), id: doc.id}));

	return {
		plants
	};
}

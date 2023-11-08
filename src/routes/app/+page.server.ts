import { PlantDto } from '../../lib/domain/Plant';

export async function load({ locals }) {
	const db = locals.app.firestore();

	const plantDocs = await db.collection('plants').where('owner', '==', locals.uid).get();
	const plants = plantDocs.docs.map((doc) => PlantDto.parse({...doc.data(), id: doc.id}));

	return {
		plants
	};
}

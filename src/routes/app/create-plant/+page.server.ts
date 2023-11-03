import { error, fail, redirect } from '@sveltejs/kit';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, Timestamp, getFirestore } from 'firebase-admin/firestore';
import { DateTime } from 'luxon';
import { z, type ZodIssue } from 'zod';
import functions from 'firebase-functions';

const PlantFormSchema = z.object({
	name: z.string().min(3),
	watering_interval: z.coerce.number().int().positive(),
	watering_amount: z.coerce.number().int().positive(),
	last_watering: z.preprocess((v) => (v === '' ? null : v), z.string().datetime().nullable()),
	instructions: z.preprocess((v) => (v === '' ? null : v), z.string().nullable())
});

export const actions = {
	async default({ request, cookies, locals }) {
		const data = await request.formData();
		const name = data.get('name');
		const watering_interval = data.get('watering_interval');
		const watering_amount = data.get('watering_amount');
		const last_watering = data.get('last_watering');
		const instructions = data.get('instructions');

		const plantFormData = {
			name,
			watering_interval,
			watering_amount,
			last_watering,
			instructions
		};

		const formParseResult = PlantFormSchema.safeParse(plantFormData);

		if (!formParseResult.success) {
			return fail(400, {
				plantFormData,
				errors: formParseResult.error.issues.reduce(
					toFormattedErrors,
					{} as Record<string, string[]>
				)
			});
		}

		const idToken = cookies.get('idToken');

		if (!idToken) {
			throw error(401);
		}

		let uid;

		try {
			const userCred = await getAuth(locals.app).verifyIdToken(idToken);
			uid = userCred.uid;
		} catch (e) {
			functions.logger.error(e);
			throw error(401);
		}

		try {
			const db = getFirestore(locals.app);

			const docRef = db.collection('plants').doc();

			await docRef.set({
				name: formParseResult.data.name,
				wateringIntervalInHours: formParseResult.data.watering_interval,
				amountPerWateringInMilliliters: formParseResult.data.watering_amount,
				lastWatered: getLastWateredValue(formParseResult.data.last_watering),
				furtherInstructions: formParseResult.data.instructions,
				owner: uid
			});
		} catch (e) {
			functions.logger.error(e);
			throw error(500);
		}

		throw redirect(302, '/app');
	}
};

function toFormattedErrors(formattedIssues: Record<string, string[]>, issue: ZodIssue) {
	const field = issue.path.at(0);
	const message = issue.message;

	if (!field) {
		return formattedIssues;
	}

	formattedIssues[field] = formattedIssues[field]
		? [...formattedIssues[field], message]
		: [message];

	return formattedIssues;
}

function getLastWateredValue(publicationDate: string | null) {
	return publicationDate
		? Timestamp.fromDate(DateTime.fromISO(publicationDate, { zone: 'Europe/Berlin' }).toJSDate())
		: FieldValue.serverTimestamp();
}

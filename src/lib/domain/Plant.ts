/*

name: formParseResult.data.name,
wateringIntervalInHours: formParseResult.data.watering_interval,
amountPerWateringInMilliliters: formParseResult.data.watering_amount,
lastWatered: getLastWateredValue(formParseResult.data.last_watering),
furtherInstructions: formParseResult.data.instructions,
owner: uid,
created: FieldValue.serverTimestamp()

*/

import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';

const Plant = z.object({
	name: z.string(),
	wateringIntervalInHours: z.number(),
	amountPerWateringInMilliliters: z.number(),
	lastWatered: z.instanceof(Timestamp),
	furtherInstructions: z.string().nullish(),
	owner: z.string(),
	created: z.instanceof(Timestamp)
});

export const PlantDto = z.object({
	id: z.string(),
	name: z.string(),
	wateringIntervalInHours: z.number(),
	amountPerWateringInMilliliters: z.number(),
	lastWatered: z.preprocess((lastWatered) => {
		if (lastWatered instanceof Timestamp) {
			return lastWatered.toDate().toISOString();
		}
		return null;
	}, z.string().datetime()),
	furtherInstructions: z.string().nullish(),
	imageUrl: z.string()
});

export type PlantDto = z.infer<typeof PlantDto>;

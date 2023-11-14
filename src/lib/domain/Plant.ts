import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';

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
	fertilizingIntervalInWeeks: z.number(),
	amountPerFertilizingInGrams: z.number(),
	lastFertilized: z.preprocess((lastFertilized) => {
		if (lastFertilized instanceof Timestamp) {
			return lastFertilized.toDate().toISOString();
		}
		return null;
	}, z.string().datetime()),
	furtherInstructions: z.string().nullish(),
	imageUrl: z.string()
});

export type PlantDto = z.infer<typeof PlantDto>;

import { z } from "zod/v4";

export const reviewSchema = z.object({
  rating: z.int().min(1).max(5),
  date: z.number(),
  region: z.string(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

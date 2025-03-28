import { z } from "zod"

export const HslSchema = z.object({
    id : z.number().int().positive().optional(),
    color_hsl: z.string().min(4).max(13),
});

export const FindUniqueHSL = HslSchema.omit({
    id: true,
});

export const ColorHslSchema = z.string().min(4).max(13);

export type FindHSL = z.infer<typeof FindUniqueHSL>;
import { object, TypeOf, z } from 'zod';

export const ProcessImageRequestSchema = z.object({
  body: object({
    colorOption: z.string().regex(/^\d+-\d+-\d+$/),
    backgroundPath: z.string().min(1),
    overlayPath: z.string().min(1),
    dimension: z.number().int().positive(),
    combine_swatch: z.string().min(1),
    sku: z.string().min(1),
    waitForResult: z.boolean().optional().default(false)
  })
})

export type ProcessImageHttpRequest = TypeOf<typeof ProcessImageRequestSchema>['body'];
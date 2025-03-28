import { z } from 'zod';

export const ColorOptionSchema = z.string().regex(/^\d+-\d+-\d+$/);
export type ColorOption = z.infer<typeof ColorOptionSchema>;

export interface ImageProcessingParams {
  colorOption: ColorOption;
  backgroundPath: string;
  overlayPath: string;
  dimension: number;
}
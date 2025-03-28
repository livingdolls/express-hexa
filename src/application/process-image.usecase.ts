import { z } from "zod";
import { ImageProcessorPort } from "../core/domain/image-processor.port";
import { ColorOptionSchema } from "../core/validations/processImage.validation";

export class ProcessImageUseCase {
    constructor(private readonly imageProcessor: ImageProcessorPort) {}

    async execute(
        colorOption: string,
        backgroundPath: string,
        overlayPath: string,
        dimension: number
    ): Promise<Buffer> {
        const validatedColor = ColorOptionSchema.parse(colorOption);
        const validatedDimension = z.number().int().positive().parse(dimension);

        return this.imageProcessor.processImage(colorOption, backgroundPath, overlayPath, dimension);
    }
}
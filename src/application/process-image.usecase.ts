import { ImageProcessorPort } from "../core/domain/image-processor.port";

export class ProcessImageUseCase {
    constructor(private readonly imageProcessor: ImageProcessorPort) {}

    async execute(
        colorOption: string,
        backgroundPath: string,
        overlayPath: string,
        dimension: number
    ): Promise<Buffer> {
        return this.imageProcessor.processImage(colorOption, backgroundPath, overlayPath, dimension);
    }
}
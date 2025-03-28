export interface ImageProcessorPort {
    processImage(
        colorOption: string,
        backgroundPath: string,
        overlayPath: string,
        dimension: number
    ): Promise<Buffer>
}
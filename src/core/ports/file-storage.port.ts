export interface FileStoragePort {
    saveImage(buffer: Buffer, filename: string): Promise<string>;
    saveResizedImages(buffer: Buffer, filename: string, sizes: number[]): Promise<{
        original: string;
        variants: {[size: number] : string}
    }>
    getImageUrl(filename: string): string;
    getVariantUrl(filename: string, size: number): string;
}``
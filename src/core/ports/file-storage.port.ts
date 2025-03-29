export interface FileStoragePort {
    saveImage(buffer: Buffer, filename: string): Promise<string>;
    getImageUrl(filename: string): string;
}
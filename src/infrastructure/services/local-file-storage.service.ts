import path from "path";
import { FileStoragePort } from "../../core/ports/file-storage.port";
import fs from 'fs/promises';
import sharp from "sharp";

export class LocalFileStorageAdapter implements FileStoragePort {
    constructor(
        private readonly storagePath: string = 'uploads',
        private readonly quality: number = 80,
    ) {
        this.ensureDirectoryExists();
    }
    
    private async ensureDirectoryExists(): Promise<void> {
        try {
            await fs.mkdir(this.storagePath, {recursive: true})
        } catch(err) {
            console.error(`gagal membuat folder `, err)
        }
    }
    
    async saveImage(buffer: Buffer, filename: string): Promise<string> {
        const filePath = path.join(this.storagePath, filename);
        
        await fs.writeFile(filePath, buffer);
        
        return filePath;
    }

    async saveResizedImages(buffer: Buffer, filename: string, sizes: number[]): Promise<{ original: string; variants: { [size: number]: string; }; }> {
        const originalPah = path.join(this.storagePath, filename);
        const variants: {[size: number] : string} = {};

        await sharp(buffer).toFile(originalPah);

        await Promise.all(
            sizes.map(async (size) => {
                const variantFilename = `${size}_${filename}`;
                const variantPath = path.join(this.storagePath, variantFilename);

                await sharp(buffer)
                    .resize(size, size, {
                        fit: 'inside',
                        withoutEnlargement: true,
                    })
                    .toFormat('png', {quality: this.quality})
                    .toFile(variantPath);

                variants[size] = variantPath;
            })
        );

        return {
            original: originalPah,
            variants
        }
    }

    getImageUrl(filename: string): string {
        return `/uploads/${filename}`;
    }

    getVariantUrl(filename: string, size: number): string {
        return `/uploads/${size}_${filename.replace(/\.[^/.]+$/, '.webp')}`;
    }

}
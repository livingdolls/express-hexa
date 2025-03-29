import path from "path";
import { FileStoragePort } from "../../core/ports/file-storage.port";
import fs from 'fs/promises';

export class LocalFileStorageAdapter implements FileStoragePort {
    constructor(private readonly storagePath: string = 'uploads') {
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

    getImageUrl(filename: string): string {
        return `/upload/${filename}`;
    }

}
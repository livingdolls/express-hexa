import path from "path";
import { FileStoragePort } from "../core/ports/file-storage.port";
import { ImageMetadataRepositoryPort } from "../core/ports/image-repository.port";
import { MessageBrokerPort } from "../core/ports/message-brokers.port";
import { ProcessImageUseCase } from "./process-image.usecase";

export class ImageProcessingService {
    private readonly resizeSizes = [128,256,384,512,768,1024,1920];

    constructor(
        private readonly messageBroker: MessageBrokerPort,
        private readonly processIamgeUseCase: ProcessImageUseCase,
        private readonly fileStorage: FileStoragePort,
        private readonly imageMetadataRepository: ImageMetadataRepositoryPort,
    ) {}

    async startProcessing(queueName: string = 'image_processing'): Promise<void> {
        await this.messageBroker.Connect();
        console.log(`consumer ${queueName} is running`);

        await this.messageBroker.ConsumeFromQueue(
            queueName,
            async (message) => {
                const {
                    colorOption,
                    combine_swatch,
                    sku,
                    product_id_magento,
                    backgroundPath,
                    overlayPath,
                    dimension,
                    callbackQueue
                } = message;

                try {
                    const imageBuffer = await this.processIamgeUseCase.execute(
                        colorOption, backgroundPath, overlayPath, dimension
                    )

                    console.log('pesan diterima', colorOption);

                    const filename = `processed_${Date.now()}.png`;

                    const { original, variants } = await this.fileStorage.saveResizedImages(
                        imageBuffer,
                        filename,
                        this.resizeSizes,
                    )

                    
                    const variantsData = Object.entries(variants)
                    .map(([size, path]) => ({
                    size: parseInt(size),
                    url: this.fileStorage.getVariantUrl(filename, parseInt(size))
                    }))
                    .filter(variant => variant.url !== undefined && !isNaN(variant.size));

                    const secureUrl = this.fileStorage.getImageUrl(filename);

                    // const savedImage = this.imageMetadataRepository.saveImageMetadata({
                    //     sku,
                    //     colorOption,
                    //     productIdMagento: product_id_magento,
                    //     combineSwatch: combine_swatch,
                    //     imgUrl: backgroundPath,
                    //     imgOverlay: overlayPath,
                    //     secureUrl,
                    //     variants: variantsData,
                    // });

                    if(callbackQueue) {
                        await this.messageBroker.PublishToQueue(callbackQueue, {
                            status: 'completed',
                            originalImage: this.fileStorage.getImageUrl(filename),
                            imageVariants: Object.fromEntries(
                                Object.entries(variants).map(([size,_]) => [
                                    size,
                                    this.fileStorage.getVariantUrl(filename, parseInt(size)),
                                ])
                            ),
                            savedPaths: {
                                original,
                                ...variants,
                            }
                        })
                    }
                } catch(error: any) {
                    if(callbackQueue) {
                        await this.messageBroker.PublishToQueue(callbackQueue, {
                            status: 'failed',
                            message: error.message,
                        })
                    }
                }
            }
        )
    }

    async stopProcessing(): Promise<void> {
        await this.messageBroker.Close();
    }
}
import { FileStoragePort } from "../core/ports/file-storage.port";
import { MessageBrokerPort } from "../core/ports/message-brokers.port";
import { ProcessImageUseCase } from "./process-image.usecase";

export class ImageProcessingService {
    constructor(
        private readonly messageBroker: MessageBrokerPort,
        private readonly processIamgeUseCase: ProcessImageUseCase,
        private readonly fileStorage: FileStoragePort,
    ) {}

    async startProcessing(queueName: string = 'image_processing'): Promise<void> {
        await this.messageBroker.Connect();
        console.log(`consumer ${queueName} is running`);

        await this.messageBroker.ConsumeFromQueue(
            queueName,
            async (message) => {
                const {
                    colorOption,
                    backgroundPath,
                    overlayPath,
                    dimension,
                    callbackQueue
                } = message;

                try {
                    const imageBuffer = await this.processIamgeUseCase.execute(
                        colorOption, backgroundPath, overlayPath, dimension
                    )

                    console.log('queue jalan, diterima', colorOption);

                    const filename = `processed_${Date.now()}.png`;
                    const savedPath = await this.fileStorage.saveImage(imageBuffer, filename);
                    const imageUrl = this.fileStorage.getImageUrl(filename);

                    console.log('image saved on ', savedPath);

                    if(callbackQueue) {
                        await this.messageBroker.PublishToQueue(callbackQueue, {
                            status: 'completed',
                            imageUrl: imageUrl,
                            savedPath: savedPath,
                        });
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
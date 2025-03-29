import { ProcessImageUseCase } from "../../application/process-image.usecase";
import { Request, Response } from "express";
import { ProcessImageHttpRequest } from "../../core/validations/processImage.validation";
import { MessageBrokerPort } from "../../core/ports/message-brokers.port";

export class ImageProcessingController {
    constructor (
        private readonly processImageUseCase: ProcessImageUseCase,
        private readonly messageBroker: MessageBrokerPort,
    ) {}

    async processImage(req: Request<{}, {}, ProcessImageHttpRequest>, res: Response): Promise<void> {
        try {

            if(req.body.waitForResult) {
                const imageBuffer = await this.processImageUseCase.execute(
                    req.body.colorOption,
                    req.body.backgroundPath,
                    req.body.overlayPath,
                    req.body.dimension,
                )
    
                if(!imageBuffer) {
                    res.status(500).json('cannot process image');
                }
    
                res.set({
                    'Content-Type' : 'image/png',
                    'Content-Length' : imageBuffer.length
                });
    
                res.status(200).send(imageBuffer);
            } else {
                const correlationId = Math.random().toString(36).substring(2);
                const callbackQueue = `image_callback_${correlationId}`;

                await this.messageBroker.PublishToQueue(`image_processing`, {
                    ...req.body,
                    callbackQueue
                })

                res.status(200).json({
                    message: 'Image processing queued',
                    correlationId,
                })
            }
        } catch (err) {
            res.status(500).json('failed to process image');
        }
    }
}
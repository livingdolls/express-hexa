import { ProcessImageUseCase } from "../../application/process-image.usecase";
import { Request, Response } from "express";
import { ProcessImageHttpRequest } from "../../core/validations/processImage.validation";

export class ImageProcessingController {
    constructor (private readonly processImageUseCase: ProcessImageUseCase) {}

    async processImage(req: Request<{}, {}, ProcessImageHttpRequest>, res: Response): Promise<void> {
        try {
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
        } catch (err) {
            res.status(500).json('failed to process image');
        }
    }
}
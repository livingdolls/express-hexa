import express from "express";
import { PrismaHslRepository } from "../repository/prisma.hsl.repository";
import { HslUseCases } from "../../application/hsl.usecases";
import { HslController } from "./hsl.controller";
import { CanvasImageProcessor } from "../services/canvas-image-processor.adapter";
import { ProcessImageUseCase } from "../../application/process-image.usecase";
import { ImageProcessingController } from "./process-image.controller";
import { validate } from "./middlewares/validate.middleware";
import { ProcessImageRequestSchema } from "../../core/validations/processImage.validation";
import { RabbitMQAdapter } from "../services/rabbit-mq.adapter";
import { ImageProcessingService } from "../../application/image-processing.usecase";
import { LocalFileStorageAdapter } from "../services/local-file-storage.service";

export class Server {
    private app: express.Application;
    private imageProcessingService: ImageProcessingService | undefined;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        this.app.use(express.json());
    }

    private async initializeServices(): Promise<{
        rabbitMQAdapter: RabbitMQAdapter;
        processImageUseCase: ProcessImageUseCase;
    }> {
        const rabbitMQAdapter = new RabbitMQAdapter(process.env.RABBITMQ_URL || 'amqp://localhost');
        const imageProcessor = new CanvasImageProcessor();
        const processImageUseCase = new ProcessImageUseCase(imageProcessor);
        const fileStorage = new LocalFileStorageAdapter();

        this.imageProcessingService = new ImageProcessingService(
            rabbitMQAdapter,
            processImageUseCase,
            fileStorage,
        );

        await this.imageProcessingService.startProcessing();

        return {
            rabbitMQAdapter,
            processImageUseCase,
        };
    }

    private async routes(): Promise<void> {
        // Initialize HSL dependencies
        const hslRepository = new PrismaHslRepository();
        const hslUseCase = new HslUseCases(hslRepository);
        const hslController = new HslController(hslUseCase);

        // Initialize Image Processing dependencies
        const { rabbitMQAdapter, processImageUseCase } = await this.initializeServices();
        const imageController = new ImageProcessingController(
            processImageUseCase,
            rabbitMQAdapter,
        );

        // Setup routes
        this.app.get('/color/hsl', (req, res) => hslController.getColorByHsl(req, res));
        this.app.post(
            '/image/processing',
            validate(ProcessImageRequestSchema),
            (req, res) => imageController.processImage(req, res)
        );
    }

    public async start(port: number): Promise<void> {
        await this.routes();
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}
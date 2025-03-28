import express from "express"
import { PrismaHslRepository } from "../repository/prisma.hsl.repository";
import { HslUseCases } from "../../application/hsl.usecases";
import { HslController } from "./hsl.controller";
import { CanvasImageProcessor } from "../services/canvas-image-processor.adapter";
import { ProcessImageUseCase } from "../../application/process-image.usecase";

export class Server {
    private app: express.Application

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void {
        this.app.use(express.json());
    }

    private routes(): void {
        const hslRepository = new PrismaHslRepository();
        const hslUseCase = new HslUseCases(hslRepository);
        const hslController = new HslController(hslUseCase);

        const imageProcessor = new CanvasImageProcessor();
        const processImageUseCase = new ProcessImageUseCase(imageProcessor);

        this.app.get('/color/hsl', (req, res) => hslController.getColorByHsl(req, res));
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    }
}
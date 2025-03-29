import { Request, Response } from 'express';
import { HslUseCases } from "../../application/hsl.usecases";
import { z } from 'zod';

export class HslController {
    constructor(
      private readonly hslUseCase: HslUseCases,
    ) {}

    async getColorByHsl(req: Request, res: Response) : Promise<void> {
        try {
            const hsl = req.query.hsl as string;
            const color = await this.hslUseCase.getColorByHsl(hsl)

            if(!color) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json(color);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                  errors: error.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message,
                  })),
                });
              } else {
                res.status(500).json({ error: 'Internal server error' });
              }
        }
    }
}
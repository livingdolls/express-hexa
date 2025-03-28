import { HSL } from "../core/entities/hsl.entity";
import { HslRepositoryPort } from "../core/ports/user.repository.port";
import { ColorHslSchema } from "../core/validations/hsl.validations";

export class HslUseCases {
    constructor(private readonly hslRepository: HslRepositoryPort) {}

    async getColorByHsl(hsl : string): Promise<HSL | null> {
        const validateHsl = ColorHslSchema.parse(hsl);

        return this.hslRepository.findByHsl(hsl);
    }
}
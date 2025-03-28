import { HSL } from "../entities/hsl.entity";

export interface HslRepositoryPort {
    findByHsl(hsl: string) : Promise<HSL | null>
}
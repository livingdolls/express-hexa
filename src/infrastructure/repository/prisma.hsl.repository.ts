import { PrismaClient } from "@prisma/client";
import { HslRepositoryPort } from "../../core/ports/user.repository.port";
import { HSL } from "../../core/entities/hsl.entity";

const prisma = new PrismaClient();

export class PrismaHslRepository implements HslRepositoryPort {
    async findByHsl(hsl: string): Promise<HSL | null> {
        const data = await prisma.color_option.findUnique({where : {color_hsl: hsl}})

        if(!data) return null;

        return new HSL(
            data.id,
            data.color_hsl,
        )
    }
}
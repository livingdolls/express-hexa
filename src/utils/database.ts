import { PrismaClient } from "@prisma/client";
import { setTimeout } from "timers/promises";

const prisma = new PrismaClient();

export async function ensureDatabaseConnection() {
    const maxRetries = 10;
    const retryDelay = 5000;

    for (let i = 0; i < maxRetries; i ++) {
        try {
            await prisma.$queryRaw`SELECT 1`;
            console.log(`Database connection established`);
            return;
        } catch(err) {
            if(i === maxRetries -1) {
                console.error('Failed to connect to database after retries:', err)
                throw err;
            }
        }
        console.log(`Database connection failed (attempt ${i + 1}, retrying...)`)
        await new Promise((resolve: any)=> setTimeout(resolve, retryDelay));
    }
}

export default prisma;
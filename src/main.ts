import { Server } from "./infrastructure/http/server";
import { ensureDatabaseConnection } from "./utils/database";

async function bootstrap() {
    try {

        await Promise.all([
            ensureDatabaseConnection()
        ])

        const server = new Server();        
        server.start(3000)
    } catch(err) {
        console.error('Failed to start application:', err);
        process.exit(1);
    }
    
}

bootstrap();
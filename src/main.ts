import { Server } from "./infrastructure/http/server";

const server = new Server();

server.start(3000)
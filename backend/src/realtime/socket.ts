import type { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server | null = null;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.emit("connected", { socketId: socket.id });
  });

  return io;
}

export function getSocketServer() {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }

  return io;
}

export function emitToAll(event: string, payload: unknown) {
  if (!io) {
    return;
  }

  io.emit(event, payload);
}

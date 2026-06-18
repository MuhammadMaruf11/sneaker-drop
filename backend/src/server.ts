import "./config/env";
import { createServer } from "http";
import app from "./app";
import { initializeSocket } from "./realtime/socket";

const server = createServer(app);

initializeSocket(server);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});

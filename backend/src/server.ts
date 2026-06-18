import "./config/env";
import { createServer } from "http";
import app from "./app";
import { initializeSocket } from "./realtime/socket";
import { startExpiryJob } from "./jobs/expiry.job";

const server = createServer(app);

initializeSocket(server);
startExpiryJob();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

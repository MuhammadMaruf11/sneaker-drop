import express from "express";
import cors from "cors";
import dropRoutes from "./modules/drops/drop.routes";
import purchaseRoutes from "./modules/purchase/purchase.routes";
import reservationRoutes from "./modules/reservation/reservation.routes";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend running");
});

// Routes
app.use(authRoutes);
app.use(dropRoutes);
app.use(reservationRoutes);
app.use(purchaseRoutes);

app.use(errorMiddleware);

export default app;

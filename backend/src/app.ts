import express from "express";
import dropRoutes from "./modules/drops/drop.routes";
import purchaseRoutes from "./modules/purchase/purchase.routes";
import reservationRoutes from "./modules/reservation/reservation.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend running");
});

app.use(dropRoutes);
app.use(reservationRoutes);
app.use(purchaseRoutes);

app.use(errorMiddleware);

export default app;

import { Router } from "express";
import { purchaseReservationController } from "./purchase.controller";

const router = Router();

router.post("/purchase/:reservationId", purchaseReservationController);

export default router;

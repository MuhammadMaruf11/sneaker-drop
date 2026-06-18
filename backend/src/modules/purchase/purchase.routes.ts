import { Router } from "express";
import { purchaseReservationController, getUserPurchasesController } from "./purchase.controller";

const router = Router();

router.post("/purchases", purchaseReservationController);
router.get("/purchases/user/:userId", getUserPurchasesController);

export default router;

import { Router } from "express";
import {
  reserveDropController,
  getUserReservationsController,
} from "./reservation.controller";

const router = Router();

// POST /reservations  { userId, dropId }
router.post("/reservations", reserveDropController);

// GET /reservations/user/:userId
router.get("/reservations/user/:userId", getUserReservationsController);

export default router;

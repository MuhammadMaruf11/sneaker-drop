import { Router } from "express";
import { reserveDropController } from "./reservation.controller";

const router = Router();

router.post("/reserve/:dropId", reserveDropController);

export default router;

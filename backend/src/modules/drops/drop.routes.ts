import { Router } from "express";
import { createDropController, listDropsController } from "./drop.controller";

const router = Router();

router.post("/drops", createDropController);
router.get("/drops", listDropsController);

export default router;

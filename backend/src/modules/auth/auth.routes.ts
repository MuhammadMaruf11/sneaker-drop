import { Router } from "express";
import { createUserController, listUsersController } from "./auth.controller";

const router = Router();

router.get("/users", listUsersController);
router.post("/users", createUserController);

export default router;

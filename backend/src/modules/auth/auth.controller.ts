import type { NextFunction, Request, Response } from "express";
import { createUser, listUsers } from "./auth.service";

export async function listUsersController(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await listUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await createUser(req.body.username);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

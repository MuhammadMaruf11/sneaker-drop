import type { NextFunction, Request, Response } from "express";
import { createDrop, listDropsWithStock } from "./drop.service";

export async function createDropController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const drop = await createDrop(req.body);

    res.status(201).json(drop);
  } catch (error) {
    next(error);
  }
}

export async function listDropsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const drops = await listDropsWithStock();

    res.status(200).json(drops);
  } catch (error) {
    next(error);
  }
}

import type { NextFunction, Request, Response } from "express";
import { createReservation } from "./reservation.service";

export async function reserveDropController(
  req: Request<{ dropId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const reservation = await createReservation({
      dropId: req.params.dropId,
      userId: req.body.userId,
    });

    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
}

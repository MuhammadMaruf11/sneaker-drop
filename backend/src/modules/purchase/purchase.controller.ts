import type { NextFunction, Request, Response } from "express";
import { purchaseReservation } from "./purchase.service";

export async function purchaseReservationController(
  req: Request<{ reservationId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const purchase = await purchaseReservation({
      reservationId: req.params.reservationId,
      userId: req.body.userId,
    });

    res.status(201).json(purchase);
  } catch (error) {
    next(error);
  }
}

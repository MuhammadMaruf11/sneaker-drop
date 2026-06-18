import type { NextFunction, Request, Response } from "express";
import { createReservation, getUserActiveReservations } from "./reservation.service";

export async function reserveDropController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, dropId } = req.body;
    if (!userId || !dropId) {
      res.status(400).json({ error: "userId and dropId are required" });
      return;
    }
    const reservation = await createReservation({ userId, dropId });
    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
}

export async function getUserReservationsController(
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const reservations = await getUserActiveReservations(req.params.userId);
    res.status(200).json(reservations);
  } catch (error) {
    next(error);
  }
}

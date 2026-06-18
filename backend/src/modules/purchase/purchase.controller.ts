import type { NextFunction, Request, Response } from "express";
import { purchaseReservation } from "./purchase.service";

export async function purchaseReservationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, reservationId } = req.body;
    if (!userId || !reservationId) {
      res.status(400).json({ error: "userId and reservationId are required" });
      return;
    }
    const purchase = await purchaseReservation({ reservationId, userId });
    res.status(201).json(purchase);
  } catch (error) {
    next(error);
  }
}

export async function getUserPurchasesController(
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const { prisma } = await import("../../config/db");
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        drop: { select: { id: true, name: true } },
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(purchases);
  } catch (error) {
    next(error);
  }
}

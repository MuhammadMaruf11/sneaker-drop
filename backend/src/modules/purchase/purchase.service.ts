import { prisma } from "../../config/db";
import { ReservationStatus } from "../../generated/prisma/enums";
import { emitPurchaseCompleted } from "../../realtime/events";

type PurchaseReservationInput = {
  reservationId: string;
  userId: string;
};

export async function purchaseReservation({
  reservationId,
  userId,
}: PurchaseReservationInput) {
  const purchase = await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where: { id: reservationId },
      select: {
        id: true,
        userId: true,
        dropId: true,
        status: true,
        expiresAt: true,
      },
    });

    if (!reservation || reservation.userId !== userId) {
      throw new Error("Active reservation not found");
    }

    // Double-check expiry
    if (new Date() > reservation.expiresAt) {
      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.EXPIRED },
      });
      await tx.drop.update({
        where: { id: reservation.dropId },
        data: {
          availableStock: { increment: 1 },
          stockVersion: { increment: 1 },
        },
      });
      throw new Error("Reservation has expired");
    }

    // purchase করার আগে চেক করো already কিনেছে কিনা
    const existing = await tx.purchase.findUnique({
      where: {
        userId_dropId: {
          userId: reservation.userId,
          dropId: reservation.dropId,
        },
      },
    });
    if (existing) {
      throw new Error("You have already purchased this item");
    }

    const reservationUpdate = await tx.reservation.updateMany({
      where: {
        id: reservationId,
        userId,
        status: ReservationStatus.ACTIVE,
      },
      data: { status: ReservationStatus.PURCHASED },
    });

    if (reservationUpdate.count === 0) {
      throw new Error("Reservation is not active");
    }

    return tx.purchase.create({
      data: {
        userId: reservation.userId,
        dropId: reservation.dropId,
      },
      include: {
        user: { select: { id: true, username: true } },
        drop: { select: { id: true, name: true } },
      },
    });
  });

  emitPurchaseCompleted({
    id: purchase.id,
    userId: purchase.userId,
    dropId: purchase.dropId,
    createdAt: purchase.createdAt,
    // Extra info for activity feed
    username: purchase.user.username,
  } as any);

  return purchase;
}

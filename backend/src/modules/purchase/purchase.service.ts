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
      where: {
        id: reservationId,
      },
      select: {
        id: true,
        userId: true,
        dropId: true,
        status: true,
      },
    });

    if (!reservation || reservation.userId !== userId) {
      throw new Error("Active reservation not found");
    }

    const reservationUpdate = await tx.reservation.updateMany({
      where: {
        id: reservationId,
        userId,
        status: ReservationStatus.ACTIVE,
      },
      data: {
        status: ReservationStatus.PURCHASED,
      },
    });

    if (reservationUpdate.count === 0) {
      throw new Error("Reservation is not active");
    }

    return tx.purchase.create({
      data: {
        userId: reservation.userId,
        dropId: reservation.dropId,
      },
    });
  });

  emitPurchaseCompleted(purchase);

  return purchase;
}

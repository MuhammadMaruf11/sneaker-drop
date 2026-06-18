import { ReservationStatus } from "../../generated/prisma/enums";
import { prisma } from "../../config/db";
import {
  emitReservationCreated,
  emitReservationExpired,
  emitStockUpdated,
} from "../../realtime/events";

const RESERVATION_TTL_MS = 60 * 1000;

type CreateReservationInput = {
  userId: string;
  dropId: string;
};

export async function createReservation({ userId, dropId }: CreateReservationInput) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + RESERVATION_TTL_MS);

  const result = await prisma.$transaction(async (tx) => {
    const stockUpdate = await tx.drop.updateMany({
      where: { id: dropId, availableStock: { gt: 0 } },
      data: { availableStock: { decrement: 1 }, stockVersion: { increment: 1 } },
    });

    if (stockUpdate.count === 0) {
      const drop = await tx.drop.findUnique({ where: { id: dropId }, select: { availableStock: true } });
      if (!drop) throw new Error("Drop not found");
      throw new Error("No stock available");
    }

    const drop = await tx.drop.findUniqueOrThrow({
      where: { id: dropId },
      select: { id: true, availableStock: true, stockVersion: true, totalStock: true },
    });

    const reservation = await tx.reservation.create({
      data: { userId, dropId, status: ReservationStatus.ACTIVE, expiresAt },
    });

    return { drop, reservation };
  });

  emitStockUpdated({
    dropId: result.drop.id,
    availableStock: result.drop.availableStock,
    stockVersion: result.drop.stockVersion,
    totalStock: result.drop.totalStock,
  });
  emitReservationCreated(result.reservation);

  return result.reservation;
}

export async function getUserActiveReservations(userId: string) {
  return prisma.reservation.findMany({
    where: { userId, status: ReservationStatus.ACTIVE, expiresAt: { gt: new Date() } },
    select: {
      id: true, dropId: true, status: true, expiresAt: true, createdAt: true,
      drop: { select: { id: true, name: true, availableStock: true } },
    },
  });
}

export async function expireReservations(now = new Date()) {
  const reservations = await prisma.reservation.findMany({
    where: { status: ReservationStatus.ACTIVE, expiresAt: { lte: now } },
    select: { id: true, dropId: true },
  });

  const expiredReservations = [];

  for (const reservation of reservations) {
    const expiredReservation = await prisma.$transaction(async (tx) => {
      const reservationUpdate = await tx.reservation.updateMany({
        where: { id: reservation.id, status: ReservationStatus.ACTIVE, expiresAt: { lte: now } },
        data: { status: ReservationStatus.EXPIRED },
      });

      if (reservationUpdate.count === 0) return null;

      const drop = await tx.drop.update({
        where: { id: reservation.dropId },
        data: { availableStock: { increment: 1 }, stockVersion: { increment: 1 } },
        select: { id: true, availableStock: true, stockVersion: true, totalStock: true },
      });

      const expired = await tx.reservation.findUnique({ where: { id: reservation.id } });
      if (!expired) return null;
      return { drop, reservation: expired };
    });

    if (expiredReservation) {
      emitStockUpdated({
        dropId: expiredReservation.drop.id,
        availableStock: expiredReservation.drop.availableStock,
        stockVersion: expiredReservation.drop.stockVersion,
        totalStock: expiredReservation.drop.totalStock,
      });
      emitReservationExpired(expiredReservation.reservation);
      expiredReservations.push(expiredReservation.reservation);
    }
  }

  return expiredReservations;
}
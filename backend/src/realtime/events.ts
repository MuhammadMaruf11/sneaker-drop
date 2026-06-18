import { emitToAll } from "./socket";

type StockPayload = {
  dropId: string;
  availableStock: number;
  stockVersion: number;
  totalStock?: number;
};

type ReservationPayload = {
  id: string;
  userId: string;
  dropId: string;
  status: string;
  expiresAt: Date;
};

type PurchasePayload = {
  id: string;
  userId: string;
  dropId: string;
  createdAt: Date;
  username?: string; // for activity feed
};

export function emitStockUpdated(payload: StockPayload) {
  emitToAll("stock-updated", payload);
}

export function emitReservationCreated(payload: ReservationPayload) {
  emitToAll("reservation-created", payload);
}

export function emitReservationExpired(payload: ReservationPayload) {
  emitToAll("reservation-expired", payload);
}

export function emitPurchaseCompleted(payload: PurchasePayload) {
  emitToAll("purchase-completed", payload);
}

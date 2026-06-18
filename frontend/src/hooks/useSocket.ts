import { useEffect, useState } from "react";
import { socket } from "../realtime/socket";
import { useDropStore } from "../store/dropStore";

type StockPayload = {
  dropId: string;
  available?: number;
  availableStock?: number;
  stockVersion: number;
  totalStock?: number;
};

export function useSocket() {
  const updateStock = useDropStore((s) => s.updateStock);
  const addRecentBuyer = useDropStore((s) => s.addRecentBuyer);
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onStockUpdated = (payload: StockPayload) => {
      updateStock(
        payload.dropId,
        payload.availableStock ?? payload.available,
        payload.stockVersion,
        payload.totalStock,
      );
    };

    const onReservationExpired = (payload: StockPayload) => {
      updateStock(
        payload.dropId,
        payload.availableStock ?? payload.available,
        payload.stockVersion,
        payload.totalStock,
      );
    };

    const onPurchaseCompleted = (payload: {
      dropId: string;
      userId: string;
      username: string;
      createdAt: string;
    }) => {
      addRecentBuyer(payload.dropId, {
        username: payload.username,
        userId: payload.userId,
        purchasedAt: payload.createdAt,
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("stock-updated", onStockUpdated);
    socket.on("reservation-expired", onReservationExpired);
    socket.on("purchase-completed", onPurchaseCompleted);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("stock-updated", onStockUpdated);
      socket.off("reservation-expired", onReservationExpired);
      socket.off("purchase-completed", onPurchaseCompleted);
    };
  }, [updateStock, addRecentBuyer]);

  return { connected };
}
